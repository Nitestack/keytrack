import { relations } from "drizzle-orm";
import { index, pgEnum, pgTable, primaryKey } from "drizzle-orm/pg-core";

import { musicBrainzPieces } from "~/server/db/mbPieces";
import { users } from "~/server/db/users";

export const scoreTypeEnum = pgEnum("score_type", ["pdf", "images"]);

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
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
    scoreType: scoreTypeEnum().notNull(),
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
