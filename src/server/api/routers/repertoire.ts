import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { repertoirePieces } from "~/server/db/schema";
import { mbApi } from "~/server/musicbrainz";
import { getScoresByWikiUrl } from "~/services/imslp";
import {
  getImslpURLByWorkId,
  getWorkById,
  toMBWork,
} from "~/services/music-brainz";

import type { EntityType } from "musicbrainz-api";
import type { RepertoirePiece } from "~/services/repertoire";

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
      const [lookupResult, dbRepertoirePieceResult] = await Promise.allSettled([
        getWorkById(input.musicBrainzId),
        db.query.repertoirePieces.findFirst({
          where: and(
            eq(repertoirePieces.userId, session.user.id),
            eq(repertoirePieces.musicBrainzId, input.musicBrainzId),
          ),
        }),
      ]);
      if (lookupResult.status === "rejected" || !lookupResult.value)
        throw new TRPCError({ code: "NOT_FOUND" });
      if (
        dbRepertoirePieceResult.status === "rejected" ||
        !dbRepertoirePieceResult.value
      )
        throw new TRPCError({
          message: "Couldn't fetch piece from user",
          code: "BAD_REQUEST",
        });
      const piece: RepertoirePiece = {
        ...lookupResult.value,
        dateAdded: dbRepertoirePieceResult.value.dateAdded,
        pdfUrl: dbRepertoirePieceResult.value.pdfUrl,
      };
      return piece;
    }),
  getPieces: protectedProcedure.query(async ({ ctx: { db, session } }) => {
    const pieces = await db
      .select()
      .from(repertoirePieces)
      .where(eq(repertoirePieces.userId, session.user.id));
    return (
      await Promise.all(
        pieces.map(async (dbPiece) => {
          const work = await getWorkById(dbPiece.musicBrainzId);
          if (!work) return undefined;
          const piece: RepertoirePiece = {
            ...work,
            dateAdded: dbPiece.dateAdded,
            pdfUrl: dbPiece.pdfUrl,
          };
          return piece;
        }),
      )
    ).filter(Boolean);
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
