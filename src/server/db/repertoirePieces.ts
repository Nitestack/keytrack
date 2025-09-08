import { relations } from "drizzle-orm";
import { index, pgTable, primaryKey } from "drizzle-orm/pg-core";

import { musicBrainzPieces } from "~/server/db/mbPieces";
import { users } from "~/server/db/users";

export const repertoirePieces = pgTable(
  "repertoire_piece",
  (d) => ({
    musicBrainzId: d
      .uuid()
      .notNull()
      .references(() => musicBrainzPieces.id),
    userId: d
      .varchar({ length: 255 })
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),
    dateAdded: d.date().notNull().defaultNow(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
    pdfUrl: d.text().notNull(),
  }),
  (t) => [
    primaryKey({
      columns: [t.userId, t.musicBrainzId],
    }),
    index("repertoire_piece_music_brainz_id_idx").on(t.musicBrainzId),
  ],
);

export const repertoirePiecesRelations = relations(
  repertoirePieces,
  ({ one }) => ({
    user: one(users, {
      fields: [repertoirePieces.userId],
      references: [users.id],
    }),
    musicBrainzPiece: one(musicBrainzPieces, {
      fields: [repertoirePieces.musicBrainzId],
      references: [musicBrainzPieces.id],
    }),
  }),
);
