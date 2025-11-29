import { createTanstackQueryUtils } from "@orpc/tanstack-query";

import { client } from "~/server/api/client";

export const orpc = createTanstackQueryUtils(client);
