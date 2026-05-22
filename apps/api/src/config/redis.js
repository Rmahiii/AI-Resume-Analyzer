import Redis from "ioredis";
import { env } from "./env.js";
import { logger } from "./logger.js";

let redis;

export function getRedis() {
  if (!env.REDIS_URL) return null;
  if (!redis) {
    redis = new Redis(env.REDIS_URL, { lazyConnect: true, maxRetriesPerRequest: 1 });
    redis.on("error", (error) => logger.warn("Redis unavailable", { error: error.message }));
  }
  return redis;
}

export async function readCache(key) {
  const client = getRedis();
  if (!client) return null;
  try {
    if (client.status === "wait") await client.connect();
    const value = await client.get(key);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

export async function writeCache(key, value, ttlSeconds = 900) {
  const client = getRedis();
  if (!client) return;
  try {
    if (client.status === "wait") await client.connect();
    await client.set(key, JSON.stringify(value), "EX", ttlSeconds);
  } catch {
    // Analysis must still work when cache storage is down.
  }
}
