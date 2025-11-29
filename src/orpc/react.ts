import { createTanstackQueryUtils } from "@orpc/tanstack-query";

import { client } from "~/orpc/client";

export const orpc = createTanstackQueryUtils(client);
