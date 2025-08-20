import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { repertoirePieces } from "~/server/db/schema";
import { mbApi } from "~/server/musicbrainz";
import { getScoresByWikiUrl } from "~/services/imslp";

import type { EntityType, IWork, IWorkMatch } from "musicbrainz-api";

export interface Work {
  id: string;
  title: string;
  composer: string;
  arrangement?: string;
  isInRepertoire: boolean;
}

function toWork(work: IWork | IWorkMatch): Work {
  return {
    id: work.id,
    title: work.title,
    composer: getComposerName(work),
    arrangement:
      "disambiguation" in work &&
      typeof work.disambiguation === "string" &&
      work.disambiguation !== ""
        ? work.disambiguation
        : undefined,
    isInRepertoire: false,
  };
}

function resolveWorks(
  unresolvedWorks: IWorkMatch[],
  addedRepertoirePieceIds: string[],
): Work[] {
  return unresolvedWorks
    .filter((work) => !!work.relations?.find((rel) => rel.type === "composer"))
    .map((workMatch) => {
      const work = toWork(workMatch);
      work.isInRepertoire = addedRepertoirePieceIds.includes(work.id);
      return work;
    });
}

/**
 * must check beforehand relations has a relation of type `composer`
 */
function getComposerName(work: IWork): string {
  return work.relations?.find((rel) => rel.type === "composer")?.artist?.name;
}

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
      return resolveWorks(works, addedRepertoirePieceIds).sort(
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
        imslpUrl: z.string().url(),
      }),
    )
    .mutation(async ({ input, ctx: { db, session } }) => {
      await db.insert(repertoirePieces).values({
        musicBrainzId: input.musicBrainzId,
        userId: session.user.id,
        dateAdded: input.date,
        imslpUrl: input.imslpUrl,
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
        await mbApi.lookup("work", input.musicBrainzId, ["artist-rels"]),
        db.query.repertoirePieces.findFirst({
          where: and(
            eq(repertoirePieces.userId, session.user.id),
            eq(repertoirePieces.musicBrainzId, input.musicBrainzId),
          ),
        }),
      ]);
      if (lookupResult.status === "rejected")
        throw new TRPCError({ code: "NOT_FOUND" });
      if (
        dbRepertoirePieceResult.status === "rejected" ||
        !dbRepertoirePieceResult.value
      )
        throw new TRPCError({
          message: "Couldn't fetch piece from user",
          code: "BAD_REQUEST",
        });
      return {
        ...toWork(lookupResult.value),
        dateAdded: dbRepertoirePieceResult.value.dateAdded,
        imslpUrl: dbRepertoirePieceResult.value.imslpUrl,
      };
    }),
  getPieces: protectedProcedure.query(async ({ ctx: { db, session } }) => {
    const pieces = await db
      .select()
      .from(repertoirePieces)
      .where(eq(repertoirePieces.userId, session.user.id));
    return Promise.all(
      pieces.map(async (dbPiece) => ({
        ...toWork(
          await mbApi.lookup("work", dbPiece.musicBrainzId, ["artist-rels"]),
        ),
        dateAdded: dbPiece.dateAdded,
        imslpUrl: dbPiece.imslpUrl,
      })),
    );
  }),
  getImslpScores: protectedProcedure
    .input(
      z.object({
        musicBrainzId: z.string().nonempty(),
        imslpUrl: z.string().url().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      let imslpUrl = input.imslpUrl;
      if (!imslpUrl) {
        const work = await mbApi.lookup("work", input.musicBrainzId, [
          "url-rels",
          "work-rels",
        ]);
        if (!work) throw new TRPCError({ code: "NOT_FOUND" });
        if (work.relations.find((rel) => rel.type === "parts")) {
          const partsWork = await mbApi.lookup(
            "work",
            work.relations.find((rel) => rel.type === "parts")!.work!.id,
            ["url-rels", "work-rels"],
          );
          imslpUrl = partsWork?.relations?.find(
            (rel) => rel.type === "download for free",
          )?.url?.resource;
        }
        if (!imslpUrl) {
          imslpUrl = work?.relations?.find(
            (rel) => rel.type === "download for free",
          )?.url?.resource;
        }
      }
      if (!imslpUrl?.includes("imslp")) return undefined;

      return {
        imslpUrl,
        scores: await getScoresByWikiUrl(imslpUrl),
      };
    }),
});
