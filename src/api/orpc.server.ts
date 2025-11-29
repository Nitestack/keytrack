import "server-only";

import { headers } from "next/headers";

import { createRouterClient, onError } from "@orpc/server";

import { createRPCContext } from "~/api";
import { router } from "~/api/routers";

globalThis.$client = createRouterClient(router, {
  context: async () => createRPCContext({ headers: await headers() }),
  interceptors: [
    onError((error) => {
      console.error(error);
    }),
  ],
});
