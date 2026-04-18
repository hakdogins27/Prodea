// Simple in-memory rate limiter for serverless environments (per-instance)
// Note: This won't work across multiple serverless function instances, 
// but it provides basic protection against rapid requests to a single instance.

type RateLimitRecord = {
  count: number;
  lastReset: number;
};

const cache = new Map<string, RateLimitRecord>();

export function rateLimit(ip: string, limit: number = 10, windowMs: number = 60000) {
  const now = Date.now();
  const record = cache.get(ip) || { count: 0, lastReset: now };

  if (now - record.lastReset > windowMs) {
    record.count = 1;
    record.lastReset = now;
  } else {
    record.count++;
  }

  cache.set(ip, record);

  return {
    success: record.count <= limit,
    remaining: Math.max(0, limit - record.count),
    limit,
  };
}
