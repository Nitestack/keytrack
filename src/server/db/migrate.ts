/* eslint-disable no-restricted-syntax */
// ╭─────────────────────────────────────────────────────────╮
// │ DATABASE MIGRATION (STANDALONE SCRIPT)                  │
// ╰─────────────────────────────────────────────────────────╯

import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

import { env } from "~/env";

async function runMigrate() {
  console.log("⏳ Starting migrations...");

  const migrationClient = postgres({
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    host: env.DB_HOST,
    port: env.DB_PORT ? parseInt(env.DB_PORT) : undefined,
    max: 1, // only need 1 connection for migration
  });

  const db = drizzle(migrationClient);

  try {
    await migrate(db, { migrationsFolder: "drizzle" });
    console.log("✅ Migrations completed successfully");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  } finally {
    await migrationClient.end();
  }
}

void runMigrate();
