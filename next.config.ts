import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "musicmeg.b-cdn.net",
      },
      {
        protocol: "https",
        hostname: "musicMeg.b-cdn.net",
      },
      {
        protocol: "https",
        hostname: "www.toptal.com",
      },
    ],
  },
};

export default nextConfig;
