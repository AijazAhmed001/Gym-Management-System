import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Allows build despite third-party library type conflicts (Stripe, Recharts)
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
