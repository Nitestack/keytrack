import { ORPCError, os } from "@orpc/server";

import { env } from "~/env";
import { auth } from "~/server/auth";
import { db } from "~/server/db";

import type { NextRequest } from "next/server";

export async function createRPCContext(request: NextRequest) {
  const session = await auth();

  return {
    headers: request.headers,
    session,
    db,
  };
}

const o = os.$context<Awaited<ReturnType<typeof createRPCContext>>>();

const timingMiddleware = o.middleware(async ({ next, path }) => {
  const start = Date.now();

  try {
    if (env.NODE_ENV === "development") {
      // artificial delay in dev
      const waitMs = Math.floor(Math.random() * 400) + 100;
      await new Promise((resolve) => setTimeout(resolve, waitMs));
    }

    const result = await next();

    return result;
  } finally {
    console.log(
      `[oRPC] \`${path.join(".")}\` took ${Date.now() - start}ms to execute`,
    );
  }
});

export const publicProcedure = o.use(timingMiddleware);

export const protectedProcedure = publicProcedure.use(({ context, next }) => {
  if (!context.session?.user) {
    throw new ORPCError("UNAUTHORIZED");
  }

  return next({
    context: {
      session: { ...context.session, user: context.session.user },
    },
  });
});
