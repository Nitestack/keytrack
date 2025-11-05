/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */

import type { NextConfig } from "next";

import "./src/env.js";

export default {
  output: "standalone",
  experimental: {
    browserDebugInfoInTerminal: true,
    turbopackFileSystemCacheForDev: true,
  },
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        hostname: "nextuipro.nyc3.cdn.digitaloceanspaces.com",
      },
    ],
  },
} satisfies NextConfig;
