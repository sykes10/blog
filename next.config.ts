import type { NextConfig } from "next";

// Turbopack-safe Velite wiring (pattern from velite.js.org/guide/with-nextjs)
// Guard with VELITE_STARTED to avoid running twice in watch mode.
// Uses process.argv detection (not webpack hooks) to stay compatible with Turbopack.
const isDev = process.argv.includes("dev");
const isBuild = process.argv.includes("build");

if (!process.env.VELITE_STARTED && (isDev || isBuild)) {
  process.env.VELITE_STARTED = "1";
  const { build } = await import("velite");
  await build({ watch: isDev, clean: !isDev });
}

const nextConfig: NextConfig = {
  reactCompiler: true,
};

export default nextConfig;
