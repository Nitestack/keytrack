import { NextResponse } from "next/server";

import { RPCHandler } from "@orpc/server/fetch";

import { createRPCContext } from "~/api";
import { router } from "~/api/routers";

const handler = new RPCHandler(router);

async function handleRequest(request: Request) {
  const { response } = await handler.handle(request, {
    prefix: "/api/rpc",
    context: await createRPCContext(request),
  });

  return response ?? new NextResponse("Not found", { status: 404 });
}

// https://nextjs.org/docs/app/api-reference/file-conventions/route#http-methods
export const GET = handleRequest;
export const HEAD = handleRequest;
export const POST = handleRequest;
export const PUT = handleRequest;
export const DELETE = handleRequest;
export const PATCH = handleRequest;
