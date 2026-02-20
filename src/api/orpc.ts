import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";

import type { RouterClient } from "@orpc/server";
import type { router } from "~/api/routers";

declare global {
  var $client: RouterClient<typeof router> | undefined;
}

const link = new RPCLink({
  url: () => {
    if (globalThis.window === undefined) {
      throw new Error("RPCLink is not allowed on the server side.");
    }

    return `${globalThis.window.location.origin}/api/rpc`;
  },
});

export const client: RouterClient<typeof router> =
  globalThis.$client ?? createORPCClient(link);
