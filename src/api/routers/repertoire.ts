import { ORPCError } from "@orpc/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

import { protectedProcedure } from "~/api";
import {
  musicBrainzComposers,
  musicBrainzPieces,
  repertoirePieces,
} from "~/server/db/schema";
import { mbApi } from "~/server/musicbrainz";
import {
  downloadAndStoreImages,
  downloadAndStorePdf,
  storeImages,
  storePdf,
} from "~/services/file-storage";
import { getPdfUrlByIndex, getScoresByWikiUrl } from "~/services/imslp";
import {
  getImslpURLByWorkId,
  getWorkById,
  toMBWork,
} from "~/services/music-brainz";
import { mapDbPieceToRepertoirePiece } from "~/services/repertoire";
import { validateImageUrl, validatePdfUrl } from "~/services/url-validator";

import type { EntityType } from "musicbrainz-api";

export const repertoireRouter = {
  search: protectedProcedure
    .input(
      z.object({
        work: z.string().nonempty(),
      }),
    )
    .handler(async ({ input, context: { db, session } }) => {
      let query = "";
      let entityType: EntityType | undefined = undefined;
      if (input.work) {
        entityType = "work";
        query = input.work;
      }
      if (!entityType)
        throw new ORPCError("BAD_REQUEST", {
          message: "No query provided",
        });
      const [searchResult, dbRepertoirePiecesResult] = await Promise.allSettled(
        [
          mbApi.search(entityType, { query }),
          db
            .select()
            .from(repertoirePieces)
            .where(eq(repertoirePieces.userId, session.user.id)),
        ],
      );
      if (searchResult.status === "rejected") {
        throw new ORPCError("NOT_FOUND");
      }
      if (dbRepertoirePiecesResult.status === "rejected")
        throw new ORPCError("BAD_REQUEST", {
          message: "Couldn't fetch pieces from user",
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
        pdfUrl: z.url().optional(),
        imslpIndexUrl: z.url().optional(),
        imageUrls: z.array(z.url()).optional(),
        scoreType: z.enum(["pdf", "images"]),
        files: z.array(z.file()).optional(),
      }),
    )
    .handler(async ({ input, context: { db, session } }) => {
      // Ensure MusicBrainz piece exists in DB
      const mbPiece = await db.query.musicBrainzPieces.findFirst({
        where: eq(musicBrainzPieces.id, input.musicBrainzId),
      });

      if (!mbPiece) {
        const mbWork = await getWorkById(input.musicBrainzId);
        if (!mbWork) throw new ORPCError("BAD_REQUEST");

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

      if (input.pdfUrl) {
        // Direct PDF URL
        const validation = await validatePdfUrl(input.pdfUrl);

        if (!validation.valid) {
          throw new ORPCError("BAD_REQUEST", {
            message: validation.error ?? "Invalid PDF URL",
          });
        }

        try {
          await downloadAndStorePdf(
            input.pdfUrl,
            session.user.id,
            input.musicBrainzId,
          );
        } catch (error) {
          throw new ORPCError("INTERNAL_SERVER_ERROR", {
            message:
              error instanceof Error
                ? `Failed to download PDF: ${error.message}`
                : "Failed to download PDF",
          });
        }
      } else if (input.imslpIndexUrl) {
        // IMSLP index URL - convert to direct PDF URL first
        try {
          const directPdfUrl = await getPdfUrlByIndex(input.imslpIndexUrl);

          if (!directPdfUrl) throw new ORPCError("BAD_REQUEST");

          await downloadAndStorePdf(
            directPdfUrl,
            session.user.id,
            input.musicBrainzId,
          );
        } catch (error) {
          throw new ORPCError("INTERNAL_SERVER_ERROR", {
            message:
              error instanceof Error
                ? `Failed to process IMSLP URL: ${error.message}`
                : "Failed to process IMSLP URL",
          });
        }
      } else if (input.imageUrls && input.imageUrls.length > 0) {
        // Multiple image URLs

        // Validate all image URLs first
        const validations = await Promise.all(
          input.imageUrls.map((url) => validateImageUrl(url)),
        );

        const invalidUrl = validations.find((v) => !v.valid);
        if (invalidUrl) {
          throw new ORPCError("BAD_REQUEST", {
            message: invalidUrl.error ?? "Invalid image URL",
          });
        }

        try {
          await downloadAndStoreImages(
            input.imageUrls,
            session.user.id,
            input.musicBrainzId,
          );
        } catch (error) {
          throw new ORPCError("INTERNAL_SERVER_ERROR", {
            message:
              error instanceof Error
                ? `Failed to download images: ${error.message}`
                : "Failed to download images",
          });
        }
      } else if (input.files) {
        if (input.scoreType === "pdf") {
          const buffer = Buffer.from(await input.files[0]!.arrayBuffer());
          await storePdf(buffer, session.user.id, input.musicBrainzId);
        } else {
          const imageBuffers = await Promise.all(
            input.files.map(async (file) => ({
              buffer: Buffer.from(await file.arrayBuffer()),
              filename: file.name,
            })),
          );

          await storeImages(imageBuffers, session.user.id, input.musicBrainzId);
        }
      }
      // Insert into database
      await db.insert(repertoirePieces).values({
        musicBrainzId: input.musicBrainzId,
        userId: session.user.id,
        scoreType: input.scoreType,
      });
    }),
  getPiece: protectedProcedure
    .input(
      z.object({
        musicBrainzId: z.string().nonempty(),
      }),
    )
    .handler(async ({ input, context: { db, session } }) => {
      const piece = await db.query.repertoirePieces.findFirst({
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

      if (!piece) throw new ORPCError("NOT_FOUND");

      return mapDbPieceToRepertoirePiece(piece);
    }),
  removePiece: protectedProcedure
    .input(
      z.object({
        musicBrainzId: z.string().nonempty(),
      }),
    )
    .handler(async ({ input, context: { db, session } }) => {
      return await db
        .delete(repertoirePieces)
        .where(
          and(
            eq(repertoirePieces.userId, session.user.id),
            eq(repertoirePieces.musicBrainzId, input.musicBrainzId),
          ),
        );
    }),
  getPieces: protectedProcedure.handler(
    async ({ context: { db, session } }) => {
      const pieces = await db.query.repertoirePieces.findMany({
        where: eq(repertoirePieces.userId, session.user.id),
        with: {
          musicBrainzPiece: {
            with: {
              composer: true,
            },
          },
        },
      });

      const results = await Promise.allSettled(
        pieces.map(mapDbPieceToRepertoirePiece),
      );

      return results
        .map((result) => {
          if (result.status === "fulfilled") return result.value;
          return undefined;
        })
        .filter(Boolean);
    },
  ),
  getImslpScores: protectedProcedure
    .input(
      z.object({
        musicBrainzId: z.string().nonempty(),
      }),
    )
    .handler(async ({ input }) => {
      const imslpUrl = await getImslpURLByWorkId(input.musicBrainzId);

      if (!imslpUrl) return undefined;

      const scores = await getScoresByWikiUrl(imslpUrl);

      if (scores.length <= 0) return undefined;

      return {
        imslpUrl,
        scores,
      };
    }),
};
