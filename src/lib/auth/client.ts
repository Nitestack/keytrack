import { createAuthClient } from "better-auth/react";

export const auth = createAuthClient();

export type ClientSession = typeof auth.$Infer.Session;

export function signIn() {
  return auth.signIn.social({
    provider: "google",
    callbackURL: "/repertoire",
  });
}
