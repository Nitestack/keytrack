import { repertoireRouter } from "~/server/api/routers/repertoire";

import type { InferRouterInputs, InferRouterOutputs } from "@orpc/server";

export const router = {
  repertoire: repertoireRouter,
};

export type RouterInputs = InferRouterInputs<typeof router>;

export type RouterOutputs = InferRouterOutputs<typeof router>;
