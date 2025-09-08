import { relations } from "drizzle-orm";
import { pgTable } from "drizzle-orm/pg-core";

import { musicBrainzPieces } from "~/server/db/mbPieces";

export const musicBrainzComposers = pgTable("musicbrainz_composer", (d) => ({
  id: d.uuid().primaryKey(),
  name: d.text().notNull(),
  sortedName: d.text().notNull(),
}));

export const mbComposersRelations = relations(
  musicBrainzComposers,
  ({ many }) => ({
    musicBrainzPieces: many(musicBrainzPieces),
  }),
);
