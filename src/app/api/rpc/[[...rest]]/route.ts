import { onError } from "@orpc/server";
import { RPCHandler } from "@orpc/server/fetch";

import { createRPCContext } from "~/orpc/server";
import { router } from "~/server/api";

import type { NextRequest } from "next/server";

const handler = new RPCHandler(router, {
  interceptors: [
    onError((error) => {
      console.error(error);
    }),
  ],
});

async function handleRequest(request: NextRequest) {
  const { response } = await handler.handle(request, {
    prefix: "/api/orpc",
    context: await createRPCContext(request),
  });

  return response ?? new Response("Not found", { status: 404 });
}

// https://nextjs.org/docs/app/api-reference/file-conventions/route#http-methods
export const GET = handleRequest;
export const HEAD = handleRequest;
export const POST = handleRequest;
export const PUT = handleRequest;
export const DELETE = handleRequest;
export const PATCH = handleRequest;
