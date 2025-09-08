import { relations } from "drizzle-orm";
import { pgTable } from "drizzle-orm/pg-core";

import { musicBrainzComposers } from "~/server/db/mbComposer";
import { repertoirePieces } from "~/server/db/repertoirePieces";

export const musicBrainzPieces = pgTable("musicbrainz_piece", (d) => ({
  id: d.uuid().primaryKey(),
  title: d.text().notNull(),
  arrangement: d.text(),
  composerId: d
    .uuid()
    .notNull()
    .references(() => musicBrainzComposers.id),
}));

export const mbPiecesRelations = relations(
  musicBrainzPieces,
  ({ one, many }) => ({
    composer: one(musicBrainzComposers, {
      fields: [musicBrainzPieces.composerId],
      references: [musicBrainzComposers.id],
    }),
    repertoirePieces: many(repertoirePieces),
  }),
);
