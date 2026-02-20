import { ORPCError, os } from "@orpc/server";

import { auth } from "~/lib/auth/server";
import { createRequestLogger } from "~/lib/logger/server";
import { db } from "~/server/db";

export async function createRPCContext({ headers }: { headers: Headers }) {
  const session = await auth.api.getSession({
    headers,
  });
  return {
    headers,
    session,
    db,
    logger: createRequestLogger(session?.user?.id, headers.get("X-Request-ID")),
  };
}

const o = os.$context<Awaited<ReturnType<typeof createRPCContext>>>();

const loggingMiddleware = o.middleware(async ({ next, path, context }) => {
  const procedureLogger = context.logger.child({
    rpc: {
      ...(context.logger.bindings().rpc as Record<string, unknown> | undefined),
      method: path.join("."),
    },
  });

  try {
    return await next({
      context: {
        ...context,
        logger: procedureLogger,
      },
    });
  } catch (err) {
    procedureLogger.error(err);
    throw err;
  }
});

export const publicProcedure = o.use(loggingMiddleware);

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
