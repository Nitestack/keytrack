import { relations } from "drizzle-orm";
import { index, pgTable } from "drizzle-orm/pg-core";

import { repertoirePieces } from "~/server/db/repertoirePieces";

export const users = pgTable("user", (d) => ({
  id: d.text("id").primaryKey(),
  name: d.text("name").notNull(),
  email: d.text("email").notNull().unique(),
  emailVerified: d.boolean("email_verified").default(false).notNull(),
  image: d.text("image"),
  createdAt: d.timestamp("created_at").defaultNow().notNull(),
  updatedAt: d
    .timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
}));

export const sessions = pgTable(
  "session",
  (d) => ({
    id: d.text("id").primaryKey(),
    expiresAt: d.timestamp("expires_at").notNull(),
    token: d.text("token").notNull().unique(),
    createdAt: d.timestamp("created_at").defaultNow().notNull(),
    updatedAt: d
      .timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: d.text("ip_address"),
    userAgent: d.text("user_agent"),
    userId: d
      .text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  }),
  (t) => [index("session_userId_idx").on(t.userId)],
);

export const accounts = pgTable(
  "account",
  (d) => ({
    id: d.text("id").primaryKey(),
    accountId: d.text("account_id").notNull(),
    providerId: d.text("provider_id").notNull(),
    userId: d
      .text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    accessToken: d.text("access_token"),
    refreshToken: d.text("refresh_token"),
    idToken: d.text("id_token"),
    accessTokenExpiresAt: d.timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: d.timestamp("refresh_token_expires_at"),
    scope: d.text("scope"),
    password: d.text("password"),
    createdAt: d.timestamp("created_at").defaultNow().notNull(),
    updatedAt: d
      .timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  }),
  (table) => [index("account_userId_idx").on(table.userId)],
);

export const verifications = pgTable(
  "verification",
  (d) => ({
    id: d.text("id").primaryKey(),
    identifier: d.text("identifier").notNull(),
    value: d.text("value").notNull(),
    expiresAt: d.timestamp("expires_at").notNull(),
    createdAt: d.timestamp("created_at").defaultNow().notNull(),
    updatedAt: d
      .timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  }),
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const userRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  accounts: many(accounts),
  repertoirePieces: many(repertoirePieces),
}));

export const sessionRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const accountRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));
