/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */

import type { NextConfig } from "next";

import "./src/env";

export default {
  output: "standalone",
  experimental: {
    browserDebugInfoInTerminal: true,
  },
  images: {
    localPatterns: [
      {
        pathname: "/logo.png",
        search: "",
      },
      {
        pathname: "/api/files/**",
        search: "",
      },
    ],
  },
  reactCompiler: true,
} satisfies NextConfig;
