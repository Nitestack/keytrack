import { createAuthClient } from "better-auth/react";

export const auth = createAuthClient();

export type ClientSession = typeof auth.$Infer.Session;
