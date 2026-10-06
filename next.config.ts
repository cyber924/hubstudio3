import type { NextConfig } from "next";
import { SITE_ORIGIN } from "./lib/site";

const nextConfig: NextConfig = {
  async redirects() {
    return ["www.hubstudioai.co.kr", "hubstudio3.vercel.app"].map((host) => ({
      source: "/:path*",
      has: [{ type: "host" as const, value: host }],
      destination: `${SITE_ORIGIN}/:path*`,
      permanent: true,
    }));
  },
};

export default nextConfig;
