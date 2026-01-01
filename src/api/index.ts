import { ORPCError, os } from "@orpc/server";

import { auth } from "~/lib/auth/server";
import { db } from "~/server/db";

export async function createRPCContext({ headers }: { headers: Headers }) {
  const session = await auth.api.getSession({
    headers,
  });

  return {
    headers,
    session,
    db,
  };
}

const o = os.$context<Awaited<ReturnType<typeof createRPCContext>>>();

const timingMiddleware = o.middleware(async ({ next, path }) => {
  const start = Date.now();

  try {
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
