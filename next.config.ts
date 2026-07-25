import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Don't fingerprint the framework/version to clients.
  poweredByHeader: false,
};

export default nextConfig;
