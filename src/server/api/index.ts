import { repertoireRouter } from "~/server/api/routers/repertoire";

export const router = {
  repertoire: repertoireRouter,
};

export type AppRouter = typeof router;
