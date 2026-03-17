import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@takumi-rs/core"],
  experimental: {
    useCache: true,
  },
};

export default nextConfig;
