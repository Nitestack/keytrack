import pino from "pino";

import { env } from "~/env";

export const logger = pino({
  level:
    globalThis.window === undefined
      ? (env.LOG_LEVEL ?? "info")
      : (env.NEXT_PUBLIC_LOG_LEVEL ?? "error"),
  browser: {
    asObject: true,
  },
  transport:
    globalThis.window === undefined && env.NODE_ENV === "development"
      ? {
          target: "pino-pretty",
          options: {
            colorize: true,
          },
        }
      : undefined,
});
