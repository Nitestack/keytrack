import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { env } from "~/env";
import * as schema from "~/server/db/schema";

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */
const globalForDatabase = globalThis as unknown as {
  conn: postgres.Sql | undefined;
};

const conn =
  globalForDatabase.conn ??
  postgres({
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    port: env.DB_PORT ? Number.parseInt(env.DB_PORT) : undefined,
    host: env.DB_HOST,
  });
if (env.NODE_ENV !== "production") globalForDatabase.conn = conn;

export const db = drizzle(conn, { schema });
