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
   * The url of the score
   * @example "https://imslp.org/wiki/Special:ImagefromIndex/34484/qraj"
   */
  pdfUrl: string;
  /**
   * The date when the piece was added to the repertoire
   * @example "2025-08-21"
   */
  dateAdded: string;
}
