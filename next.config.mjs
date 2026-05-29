// V4.0 build trigger
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  allowedDevOrigins: [
    ".space.chatglm.site",
    ".space-z.ai",
  ],
};

export default nextConfig;
