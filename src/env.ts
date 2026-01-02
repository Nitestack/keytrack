import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

import type { LevelWithSilentOrString } from "pino";

const logLevelSchema = z.enum<LevelWithSilentOrString[]>([
  "fatal",
  "error",
  "warn",
  "info",
  "debug",
  "trace",
  "silent",
]);

export const env = createEnv({
  server: {
    BETTER_AUTH_SECRET:
      process.env.NODE_ENV === "production"
        ? z.string()
        : z.string().optional(),
    GOOGLE_ID: z.string(),
    GOOGLE_SECRET: z.string(),
    DB_USER: z.string().optional(),
    DB_PASSWORD: z.string(), // must be required because of PostgreSQL Docker image
    DB_HOST:
      process.env.NODE_ENV === "production"
        ? z.string()
        : z.string().prefault("localhost"), // must be required because of Drizzle
    DB_NAME: z.string(), // must be required because of Drizzle
    DB_PORT: z.string().optional(),
    LOG_LEVEL: logLevelSchema.prefault("info"),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .prefault("development"),
  },
  /**
   * `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_LOG_LEVEL: logLevelSchema.prefault("error"),
  },
  runtimeEnv: {
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    GOOGLE_ID: process.env.GOOGLE_ID,
    GOOGLE_SECRET: process.env.GOOGLE_SECRET,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_HOST: process.env.DB_HOST,
    DB_NAME: process.env.DB_NAME,
    DB_PORT: process.env.DB_PORT,
    NODE_ENV: process.env.NODE_ENV,
    LOG_LEVEL: process.env.LOG_LEVEL,
    NEXT_PUBLIC_LOG_LEVEL: process.env.NEXT_PUBLIC_LOG_LEVEL,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});
