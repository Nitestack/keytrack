import "server-only";

import { randomUUID } from "node:crypto";

import { logger } from "~/lib/logger";

export function createRequestLogger(
  userId?: string,
  requestId?: string | null,
) {
  requestId ??= randomUUID();

  return logger.child({
    rpc: {
      id: requestId,
    },
    session: userId
      ? {
          userId,
        }
      : null,
  });
}
