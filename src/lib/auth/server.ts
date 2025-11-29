import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { env } from "~/env";
import { db } from "~/server/db";
import { accounts, sessions, users, verifications } from "~/server/db/schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: users,
      account: accounts,
      session: sessions,
      verification: verifications,
    },
  }),
  socialProviders: {
    google: {
      clientSecret: env.GOOGLE_SECRET,
      clientId: env.GOOGLE_ID,
    },
  },
});

export type ServerSession = typeof auth.$Infer.Session;
