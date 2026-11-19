import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    CLIENT_URL: process.env.CLIENT_URL || "http://localhost:3000",
    SERVER_URL: process.env.SERVER_URL || "http://localhost:5000",
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "i.ibb.co" },
      { protocol: "https", hostname: "randomuser.me" },
    ],
  },
  reactCompiler: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
