import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/**
 * Per-IP sliding-window limiter, server-side only. Backed by Upstash Redis
 * when configured — required for correctness on serverless, since an
 * in-memory Map is scoped to a single warm instance and does nothing to
 * stop an attacker fanning requests out across concurrent instances on
 * this app's billable Gemini route. Falls back to an in-memory limiter
 * only when Redis isn't configured, so local dev keeps working without
 * extra setup; that fallback gives no real protection in production.
 */
export function createRateLimiter({
  limit,
  windowMs,
  prefix = "kreku:ratelimit",
  maxTrackedIps = 5000,
}: {
  limit: number;
  windowMs: number;
  prefix?: string;
  maxTrackedIps?: number;
}) {
  // Vercel's Upstash Marketplace integration injects KV_REST_API_URL/TOKEN
  // (its own KV naming), not the UPSTASH_REDIS_REST_* names @upstash/redis
  // expects by default — support both so this works whether Redis was
  // provisioned via Vercel Marketplace or a raw Upstash account.
  const redisUrl = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;

  if (redisUrl && redisToken) {
    const ratelimit = new Ratelimit({
      redis: new Redis({ url: redisUrl, token: redisToken }),
      limiter: Ratelimit.slidingWindow(limit, `${Math.round(windowMs / 1000)} s`),
      prefix,
    });
    return async function isRateLimited(ip: string): Promise<boolean> {
      const { success } = await ratelimit.limit(ip);
      return !success;
    };
  }

  console.warn(
    `[rate-limit] KV_REST_API_URL/TOKEN (or UPSTASH_REDIS_REST_URL/TOKEN) not set — "${prefix}" ` +
      "is falling back to an in-memory limiter that does not hold across serverless instances. " +
      "Provision Redis (Vercel Marketplace → Upstash) before relying on this in production.",
  );

  const requestLog = new Map<string, number[]>();
  return async function isRateLimited(ip: string): Promise<boolean> {
    const now = Date.now();
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
