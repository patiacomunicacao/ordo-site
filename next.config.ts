import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Serve locally uploaded images via next/image
  images: {
    remotePatterns: [],
  },
};

export default nextConfig;
