/**
 * Best-effort client IP for rate limiting and geolocation.
 *
 * X-Forwarded-For is a comma-separated hop chain where each proxy APPENDS the
 * address it saw the request come from. The first entry is whatever the
 * original client sent (anyone can set `X-Forwarded-For: 1.2.3.4`), so keying
 * a rate limiter on it lets an attacker mint unlimited buckets. The LAST entry
 * is the address our own edge/reverse proxy observed directly and can't be
 * forged by the client, so use that.
 */
export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const hops = forwardedFor
      .split(",")
      .map((hop) => hop.trim())
      .filter(Boolean);
    if (hops.length > 0) return hops[hops.length - 1];
  }
  return request.headers.get("x-real-ip") ?? "unknown";
}
