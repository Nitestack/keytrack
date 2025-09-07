import { relations } from "drizzle-orm";
import { index, pgTable, primaryKey } from "drizzle-orm/pg-core";

import { users } from "~/server/db/users";

export const repertoirePieces = pgTable(
  "repertoire_piece",
  (d) => ({
    musicBrainzId: d.uuid().notNull(),
    userId: d
      .varchar({ length: 255 })
      .notNull()
      .references(() => users.id),
    dateAdded: d.date().notNull().defaultNow(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
    pdfUrl: d.text().notNull(),
  }),
  (t) => [
    primaryKey({
      columns: [t.userId, t.musicBrainzId],
    }),
    index("repertoire_piece_user_id_idx").on(t.userId),
  ],
);

export const repertoirePiecesRelations = relations(
  repertoirePieces,
  ({ one }) => ({
    user: one(users, {
      fields: [repertoirePieces.userId],
      references: [users.id],
    }),
  }),
);
