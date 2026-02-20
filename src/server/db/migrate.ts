#!/usr/bin/env node
/* eslint-disable no-restricted-syntax */
// ╭─────────────────────────────────────────────────────────╮
// │ DATABASE MIGRATION (STANDALONE SCRIPT)                  │
// ╰─────────────────────────────────────────────────────────╯
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

import { env } from "~/env";

console.log("⏳ Starting migrations...");

const migrationClient = postgres({
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  host: env.DB_HOST,
  port: env.DB_PORT ? Number.parseInt(env.DB_PORT) : undefined,
  max: 1, // only need 1 connection for migration
});

const database = drizzle(migrationClient);

try {
  await migrate(database, { migrationsFolder: "drizzle" });
  console.log("✅ Migrations completed successfully");
} catch (err) {
  console.error("❌ Migration failed:", err);
  process.exit(1);
} finally {
  await migrationClient.end();
}
