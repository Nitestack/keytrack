import { TRPCError } from "@trpc/server";
import { load } from "cheerio";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { repertoirePieces } from "~/server/db/schema";
import { mbApi } from "~/server/musicbrainz";

import type { EntityType, IWork, IWorkMatch } from "musicbrainz-api";

export interface Work {
  id: string;
  title: string;
  composer: string;
  arrangement?: string;
  isInRepertoire: boolean;
}

export interface ImslpScore {
  id: string;
  title: string;
  url: string;
  publishment: ImslpScorePublisher;
  pages: string;
  fileSize: string;
  isUrtext: boolean;
}

export interface ImslpScorePublisher {
  publisher: string;
  publishDate?: string;
  city?: string;
  plate?: string;
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

function replaceAllHTMLTags(text: string) {
  return load(text).text().trim();
}

function parsePublishment(
  html: string,
): ImslpScorePublisher & { title?: string } {
  const result: ImslpScorePublisher & { title?: string } = {
    publisher: "",
  };

  const workingText = html
    .trim()
    .split("\n")[0]! // Take only first line if there are single newlines
    .split(/urtext\s/i)[0]! // Take only the part before "urtext" (case-insensitive)
    .split("<div")[0]! // Remove any boxes
    .trim();

  let publisherPart = "";

  // if two parts, first is always title, second is publishment info
  const splitParts = workingText.split("<br>");
  if (splitParts.length > 1) {
    result.title = replaceAllHTMLTags(splitParts[0]!);
    publisherPart = replaceAllHTMLTags(splitParts[1]!);
  } else {
    publisherPart = replaceAllHTMLTags(workingText);
  }

  // City
  if (publisherPart.includes(":")) {
    const [city, ...newPublisherParts] = publisherPart.split(":");
    result.city = city!.trim();
    publisherPart = newPublisherParts.join(":").trim();
  }
  // Plate
  if (publisherPart.includes("Plate")) {
    const [newPublisherParts, plate] = publisherPart.split("Plate");
    result.plate = plate!.replace(/\.$/, "").trim();
    publisherPart = newPublisherParts!.trim();
  }
  const match = /^(.*?)(?:, ([^,]*)\.)?$/.exec(publisherPart);
  if (match) {
    result.publisher = match[1]!.trim();
    result.publishDate = match[2]?.trim();
  } else {
    result.publisher = publisherPart.trim();
  }
  return result;
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

      const response = await fetch(imslpUrl, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.5",
          "Accept-Encoding": "gzip, deflate",
          DNT: "1",
          Connection: "keep-alive",
        },
      });
      if (!response.ok) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const $ = load(await response.text());
      const scores: ImslpScore[] = [];
      $("#wpscoresection #tabScore1")
        .children(".we")
        .each((_, scoreElement) => {
          const $score = $(scoreElement);

          const $publishers = $score
            .find("table tbody tr .we_edition_info_i table tbody")
            .children("tr");

          const unresolvedPublisher = $publishers
            .find("th")
            .filter((_, el) => $(el).text().startsWith("Pub"))
            .siblings("td");

          const publishment = parsePublishment(
            unresolvedPublisher.html() ?? "",
          );
          const isUrtext = $score
            .find("table tbody tr .we_edition_info_i table tbody")
            .text()
            .toLowerCase()
            .includes("urtext");

          scores.push(
            ...$score
              .children()
              .not("table")
              .filter((_, el) => {
                return (
                  $(el)
                    .find(".we_file_download p span a")
                    .attr("href")
                    ?.endsWith(".pdf") ?? false
                );
              }) // ensure it's a PDF
              .map((_, scoreHeadingElement) => {
                const metadata = $(scoreHeadingElement).find(
                  ".we_file_download p",
                );
                const [unresolvedId, unresolvedData] = metadata
                  .find(".we_file_info2")
                  .text()
                  .split("-");
                const [unresolvedFileSize, unresolvedPages] = unresolvedData
                  .trim()
                  ?.split(",");

                let title = metadata.find("b a span").text().trim();
                if (publishment.title) {
                  title = title.replace("Complete Score", publishment.title);
                }

                return {
                  title,
                  url: metadata.find("b a").attr("href"),
                  id: unresolvedId.replace(/\D/g, ""),
                  fileSize: unresolvedFileSize.trim(),
                  pages: unresolvedPages.trim(),
                  publishment,
                  isUrtext,
                } as ImslpScore;
              }),
          );
        });
      /**
       * sorts the result:
       * 1. whether it is Urtext edition or not
       * 2. whether the title is not "Complete Score"
       * 3. publisher
       * 4. title
       */
      return {
        imslpUrl,
        scores: scores.sort(
          (a, b) =>
            (a.isUrtext ? -1 : b.isUrtext ? 1 : 0) ||
            a.publishment.publisher.localeCompare(b.publishment.publisher) ||
            (!a.title.toLowerCase().includes("complete score")
              ? -1
              : !b.title.toLowerCase().includes("complete score")
                ? 1
                : 0) ||
            a.title.localeCompare(b.title),
        ),
      };
    }),
});
