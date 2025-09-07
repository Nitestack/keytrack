/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */

import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
  output: "standalone",
  experimental: {
    browserDebugInfoInTerminal: true,
    reactCompiler: true,
  },
  typedRoutes: true,
};

export default config;
