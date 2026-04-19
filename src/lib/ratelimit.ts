import { Ratelimit } from "@upstash/ratelimit";
import { getRedis } from "./redis";

let limiter: Ratelimit | null = null;

export function getRatelimit(): Ratelimit {
  if (limiter) return limiter;
  limiter = new Ratelimit({
    redis: getRedis(),
    limiter: Ratelimit.slidingWindow(60, "1 m"),
    analytics: false,
    prefix: "bizdays:rl",
  });
  return limiter;
}

export async function checkRateLimit(identifier: string): Promise<{
  success: boolean;
  remaining: number;
  limit: number;
  reset: number;
}> {
  const rl = getRatelimit();
  const res = await rl.limit(identifier);
  return {
    success: res.success,
    remaining: res.remaining,
    limit: res.limit,
    reset: res.reset,
  };
}
