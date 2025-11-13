import { mbApi } from "~/server/musicbrainz";

import type { IWork, IWorkMatch } from "musicbrainz-api";
import type { RepertoirePiece } from "~/services/repertoire";

/**
 * MusicBrainz work object
 */
export interface MBWork
  extends Omit<RepertoirePiece, "scoreType" | "scoreUrls"> {
  /**
   * Whether the piece is in the user's current repertoire
   */
  isInRepertoire: boolean;
}

/**
 * MusicBrainz work object with relations
 */
interface IWorkWithRelations extends IWork {
  /**
   * A list of relations associated with the work
   */
  relations: ({ type: string } & Record<string, unknown>)[];
}

/**
 * Whether the work has relations
 * @param work - The MusicBrainz work object to check
 * @returns guard that checks if the work has relations
 */
function hasRelations(work: IWork | IWorkMatch): work is IWorkWithRelations {
  return "relations" in work && Array.isArray(work.relations);
}

/**
 * Retrieves the composer name and sorted name from a MusicBrainz work object
 * @param work - The MusicBrainz work object
 * @returns The composer id, name and sorted name or undefined if no composer relation exists
 */
function getComposerNames(
  work: IWorkWithRelations,
): Pick<MBWork, "composerId" | "composer" | "composerSortedName"> | undefined {
  // @ts-expect-error When the relation is of type `composer`, it has an artist object
  const composerRelation:
    | {
        artist: {
          id: string;
          name: string;
          "sort-name": string;
        };
      }
    | undefined = work.relations.find((rel) => rel.type === "composer");
  if (!composerRelation) return undefined;

  const { artist } = composerRelation;
  return {
    composerId: artist.id,
    composer: artist.name,
    composerSortedName: artist["sort-name"],
  };
}

/**
 * Converts a MusicBrainz work object or match to a more usable format
 * @param work - The MusicBrainz work object or match (from a search result)
 * @returns the resolved MusicBrainz work object
 */
export function toMBWork(work: IWork | IWorkMatch): MBWork | undefined {
  if (!hasRelations(work)) return undefined;

  const composerInfo = getComposerNames(work);
  if (!composerInfo) return undefined;

  return {
    id: work.id,
    title: work.title,
    arrangement:
      "disambiguation" in work &&
      typeof work.disambiguation === "string" &&
      work.disambiguation !== ""
        ? work.disambiguation
        : undefined,
    isInRepertoire: false,
    ...composerInfo,
  };
}

/**
 * Retrieves a resolved MusicBrainz work by its ID
 * @param id - The MusicBrainz work ID
 * @returns the resolved MusicBrainz work object or undefined if not found
 */
export async function getWorkById(id: string) {
  try {
    return toMBWork(await mbApi.lookup("work", id, ["artist-rels"]));
  } catch (err) {
    console.error(err);
    return undefined;
  }
}

/**
 * Retrieves the IMSLP URL of a piece by its MusicBrainz work ID
 * @param id - The MusicBrainz work ID of the piece
 * @returns The IMSLP URL of the piece (permanent) or undefined if not found
 */
export async function getImslpURLByWorkId(id: string) {
  try {
    const work = await mbApi.lookup("work", id, ["url-rels", "work-rels"]);

    if (!hasRelations(work)) return undefined;

    let imslpUrl: string | undefined;

    // if the piece is part of a collection, where only the collection has the IMSLP URL
    if (work.relations.find((rel) => rel.type === "parts")) {
      const partsWork = await mbApi.lookup(
        "work",
        (
          work.relations.find((rel) => rel.type === "parts") as unknown as {
            work: { id: string };
          }
        ).work.id, // `parts` relation is given through the top-level if-check
        ["url-rels", "work-rels"],
      );

      if (!hasRelations(partsWork)) return undefined;

      imslpUrl = (
        partsWork.relations.find(
          (rel) => rel.type === "download for free",
        ) as unknown as { url: { resource: string } }
      )?.url?.resource;
    }

    // if the piece is not in a collection or the collection does not have the IMSLP URL
    imslpUrl ??= (
      work.relations.find(
        (rel) => rel.type === "download for free",
      ) as unknown as { url: { resource: string } }
    )?.url?.resource;

    if (!imslpUrl?.includes("imslp")) return undefined; // if the URL is not an IMSLP URL

    return imslpUrl;
  } catch (err) {
    console.error(err);
    return undefined;
  }
}
