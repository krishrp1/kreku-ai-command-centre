/** Per-IP sliding-window limiter, server-side only. */
export function createRateLimiter({
  limit,
  windowMs,
  maxTrackedIps = 5000,
}: {
  limit: number;
  windowMs: number;
  maxTrackedIps?: number;
}) {
  const requestLog = new Map<string, number[]>();

  return function isRateLimited(ip: string): boolean {
    const now = Date.now();
    // Bound memory on a long-lived warm instance — sweep stale IPs once the
    // map gets large instead of tracking every address that ever visited.
    if (requestLog.size > maxTrackedIps) {
      for (const [key, entries] of requestLog) {
        if (entries.every((t) => now - t >= windowMs)) requestLog.delete(key);
      }
    }
    const timestamps = (requestLog.get(ip) ?? []).filter((t) => now - t < windowMs);
    timestamps.push(now);
    requestLog.set(ip, timestamps);
    return timestamps.length > limit;
  };
}
