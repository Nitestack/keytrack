import { getScoreUrls } from "~/services/file-storage";

import type { InferSelectModel } from "drizzle-orm";
import type { musicBrainzComposers } from "~/server/db/mbComposer";
import type { musicBrainzPieces } from "~/server/db/mbPieces";
import type { repertoirePieces } from "~/server/db/repertoirePieces";
import type { ScoreType } from "~/services/file-storage";

/**
 * Repertoire piece object
 */
export interface RepertoirePiece {
  /**
   * The MusicBrainz ID of the piece, which is an UUID
   * @example "dad62c26-f0f3-3d1d-a491-62078052c449"
   */
  id: string;
  /**
   * The title of the piece
   * @example 'Waltz no. 1 in E‐flat major, op. 18 "Grande Valse brillante"'
   */
  title: string;
  /**
   * The MusicBrainz ID of the composer, which is an UUID
   * @example "09ff1fe8-d61c-4b98-bb82-18487c74d7b7"
   */
  composerId: string;
  /**
   * The composer of the piece
   * @example "Frédéric Chopin"
   */
  composer: string;
  /**
   * The composer of the piece, sorted by last name first
   */
  composerSortedName: string;
  /**
   * If the piece is an arrangement, this field contains the arrangement name
   * @example "arr. Godowsky"
   */
  arrangement?: string;
  /**
   * The type of score stored for the piece
   */
  scoreType: ScoreType;
  /**
   * The url(s) of the score
   */
  scoreUrls: string[];
}

export async function mapDbPieceToRepertoirePiece({
  userId,
  musicBrainzPiece: { id, title, arrangement, composerId, composer },
  scoreType,
}: InferSelectModel<typeof repertoirePieces> & {
  musicBrainzPiece: InferSelectModel<typeof musicBrainzPieces> & {
    composer: InferSelectModel<typeof musicBrainzComposers>;
  };
}): Promise<RepertoirePiece> {
  return {
    id,
    title,
    composerId,
    scoreType,
    arrangement: arrangement ?? undefined,
    composer: composer.name,
    composerSortedName: composer.sortedName,
    scoreUrls: await getScoreUrls(userId, id, scoreType),
  };
}
