import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import {
  musicBrainzComposers,
  musicBrainzPieces,
  repertoirePieces,
} from "~/server/db/schema";
import { mbApi } from "~/server/musicbrainz";
import { getScoresByWikiUrl } from "~/services/imslp";
import {
  getImslpURLByWorkId,
  getWorkById,
  toMBWork,
} from "~/services/music-brainz";

import type { EntityType } from "musicbrainz-api";

export const repertoireRouter = createTRPCRouter({
  search: protectedProcedure
    .input(
      z.object({
        work: z.string().nonempty(),
      }),
    )
    .mutation(async ({ input, ctx: { db, session } }) => {
      let query = "";
      let entityType: EntityType | undefined = undefined;
      if (input.work) {
        entityType = "work";
        query = input.work;
      }
      if (!entityType)
        throw new TRPCError({
          message: "No query provided",
          code: "BAD_REQUEST",
        });
      const [searchResult, dbRepertoirePiecesResult] = await Promise.allSettled(
        [
          await mbApi.search(entityType, { query }),
          await db
            .select()
            .from(repertoirePieces)
            .where(eq(repertoirePieces.userId, session.user.id)),
        ],
      );
      if (searchResult.status === "rejected")
        throw new TRPCError({ code: "NOT_FOUND" });
      if (dbRepertoirePiecesResult.status === "rejected")
        throw new TRPCError({
          message: "Couldn't fetch pieces from user",
          code: "BAD_REQUEST",
        });
      const works = searchResult.value.works;
      const addedRepertoirePieceIds = dbRepertoirePiecesResult.value.map(
        (val) => val.musicBrainzId,
      );

      /**
       * Resolves works and sorts the result:
       * 1. Composer ascending (required for frontend grouping)
       * 2. Title
       * 3. Arrangement (undefined has higher priority)
       */
      return works
        .map((work) => toMBWork(work))
        .filter(Boolean)
        .map((work) => {
          work.isInRepertoire = addedRepertoirePieceIds.includes(work.id);
          return work;
        })
        .sort(
          (a, b) =>
            a.composer.localeCompare(b.composer) ||
            a.title.localeCompare(b.title) ||
            (a.arrangement === undefined
              ? -1
              : b.arrangement === undefined
                ? 1
                : a.arrangement.localeCompare(b.arrangement)),
        );
    }),
  addPiece: protectedProcedure
    .input(
      z.object({
        musicBrainzId: z.string().nonempty(),
        date: z.string().date().nonempty(),
        pdfUrl: z.string().url(),
      }),
    )
    .mutation(async ({ input, ctx: { db, session } }) => {
      const mbPiece = await db.query.musicBrainzPieces.findFirst({
        where: eq(musicBrainzPieces.id, input.musicBrainzId),
      });

      if (!mbPiece) {
        const mbWork = await getWorkById(input.musicBrainzId);
        if (!mbWork) throw new TRPCError({ code: "BAD_REQUEST" });

        await db
          .insert(musicBrainzComposers)
          .values({
            id: mbWork.composerId,
            name: mbWork.composer,
            sortedName: mbWork.composerSortedName,
          })
          .onConflictDoNothing();

        await db
          .insert(musicBrainzPieces)
          .values({
            id: mbWork.id,
            composerId: mbWork.composerId,
            title: mbWork.title,
            arrangement: mbWork.arrangement,
          })
          .onConflictDoNothing();
      }

      await db.insert(repertoirePieces).values({
        musicBrainzId: input.musicBrainzId,
        userId: session.user.id,
        dateAdded: input.date,
        pdfUrl: input.pdfUrl,
      });
    }),
  getPiece: protectedProcedure
    .input(
      z.object({
        musicBrainzId: z.string().nonempty(),
      }),
    )
    .query(async ({ input, ctx: { db, session } }) => {
      return db.query.repertoirePieces.findFirst({
        where: and(
          eq(repertoirePieces.userId, session.user.id),
          eq(repertoirePieces.musicBrainzId, input.musicBrainzId),
        ),
        with: {
          musicBrainzPiece: {
            with: {
              composer: true,
            },
          },
        },
      });
    }),
  getPieces: protectedProcedure.query(async ({ ctx: { db, session } }) => {
    return await db.query.repertoirePieces.findMany({
      where: eq(repertoirePieces.userId, session.user.id),
      with: {
        musicBrainzPiece: {
          with: {
            composer: true,
          },
        },
      },
    });
  }),
  getImslpScores: protectedProcedure
    .input(
      z.object({
        musicBrainzId: z.string().nonempty(),
        imslpUrl: z.string().url().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const imslpUrl =
        input.imslpUrl ?? (await getImslpURLByWorkId(input.musicBrainzId));

      if (!imslpUrl) return undefined;

      return {
        imslpUrl,
        scores: await getScoresByWikiUrl(imslpUrl),
      };
    }),
});
