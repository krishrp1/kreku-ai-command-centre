import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

// No nonce/proxy infra in this app, so this follows the Next.js docs'
// "Without Nonces" baseline CSP rather than the stricter nonce-based one —
// 'unsafe-inline' is required because Next injects inline hydration scripts
// and the app has no proxy to stamp a per-request nonce onto them.
const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""};
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: blob:;
  font-src 'self';
  connect-src 'self';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
`
  .replace(/\s{2,}/g, " ")
  .trim();

const nextConfig: NextConfig = {
  // Don't fingerprint the framework/version to clients.
  poweredByHeader: false,
  compiler: {
    removeConsole: isDev ? false : { exclude: ["error", "warn"] },
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: cspHeader },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
