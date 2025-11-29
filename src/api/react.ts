import { createTanstackQueryUtils } from "@orpc/tanstack-query";

import { client } from "~/api/orpc";

export const orpc = createTanstackQueryUtils(client);
