import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

type StoredValue = {
  value: string;
  expiresAt?: number;
};

class MemoryRedis {
  private store = new Map<string, StoredValue>();

  on() {
    return this;
  }

  async ping() {
    return "PONG";
  }

  async get(key: string) {
    this.deleteIfExpired(key);
    return this.store.get(key)?.value ?? null;
  }

  async set(key: string, value: string, mode?: string, ttl?: number) {
    const expiresAt =
      mode?.toUpperCase() === "EX" && ttl ? Date.now() + ttl * 1000 : undefined;
    this.store.set(key, { value, expiresAt });
    return "OK";
  }

  async setex(key: string, ttl: number, value: string) {
    this.store.set(key, { value, expiresAt: Date.now() + ttl * 1000 });
    return "OK";
  }

  async del(keys: string | string[]) {
    const keyList = Array.isArray(keys) ? keys : [keys];
    let deleted = 0;

    for (const key of keyList) {
      if (this.store.delete(key)) deleted += 1;
    }

    return deleted;
  }

  async keys(pattern: string) {
    const matcher = this.patternToRegExp(pattern);
    const result: string[] = [];

    for (const key of this.store.keys()) {
      this.deleteIfExpired(key);
      if (this.store.has(key) && matcher.test(key)) result.push(key);
    }

    return result;
  }

  private deleteIfExpired(key: string) {
    const item = this.store.get(key);
    if (item?.expiresAt && item.expiresAt <= Date.now()) {
      this.store.delete(key);
    }
  }

  private patternToRegExp(pattern: string) {
    const escaped = pattern.replace(/[.+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(`^${escaped.replace(/\*/g, ".*")}$`);
  }
}

const redisUrl = process.env.REDIS_URL?.trim();

export const isUsingMemoryRedis = !redisUrl;
export const redisSessionClient = redisUrl ? new Redis(redisUrl) : null;

const redis = redisSessionClient ?? new MemoryRedis();

if (isUsingMemoryRedis) {
  console.warn("REDIS_URL is not set. Using in-memory cache for local development.");
}

redis
  .on("connect", () => console.log("Connected to Redis"))
  .on("error", (err: Error) => console.error("Redis error:", err));

export default redis;
