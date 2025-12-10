import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/server/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME!,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : undefined,
    host:
      process.env.NODE_ENV === "production"
        ? process.env.DB_HOST!
        : (process.env.DB_HOST ?? "localhost"),
  },
});
