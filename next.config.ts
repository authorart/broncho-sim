import type { NextConfig } from "next";

// The app is fully static (all content lives in /lib/data, progress lives in
// localStorage), so Cache Components is not needed. Leaving it off also avoids
// <Activity>-preserved hidden routes keeping extra WebGL contexts alive.
const nextConfig: NextConfig = {
  reactStrictMode: true,
  turbopack: {
    // A stray lockfile in the user's home directory would otherwise be picked as the workspace root.
    root: process.cwd(),
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
