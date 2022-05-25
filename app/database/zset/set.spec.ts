import Redis from "ioredis";
import { RedisMemoryServer } from "redis-memory-server";

import { ZSetManager } from "./index";

describe("ZZSetManager", () => {
  const redisServer = new RedisMemoryServer();
  let redis: Redis = new Redis({ lazyConnect: true });

  beforeAll(async () => {
    const host = await redisServer.getHost();
    const port = await redisServer.getPort();

    redis = new Redis({
      host,
      port,
    });

    await redis.ping();
  });

  afterAll(async () => {
    redis.disconnect();
    await redisServer.stop();
  });

  it("Should save a key", async () => {
    const instance = new ZSetManager(redis);
    await instance.set("my:zset", [
      { score: "0", value: "first value" },
      { score: "50", value: "second value" },
    ]);

    const result = await redis.zrange("my:zset", 0, -1, "WITHSCORES");

    expect(result).toBeDefined();
    expect(result.length).toEqual(4);
    expect(result).toEqual(["first value", "0", "second value", "50"]);
  });

  it("Should get a key", async () => {
    const instance = new ZSetManager(redis);
    const result = await instance.get("my:zset");

    expect(result).toBeDefined();
    expect(result.value).toEqual([
      { score: "0", value: "first value" },
      { score: "50", value: "second value" },
    ]);
    expect(result.ttl).toEqual(-1);
    expect(result.key).toEqual("my:zset");
    expect(result.type).toEqual("zset");
  });

  it("Should update a key", async () => {
    const instance = new ZSetManager(redis);
    const result = await instance.update("my:zset", {
      score: "150",
      value: "third value",
    });

    expect(result.value).toEqual([
      { score: "0", value: "first value" },
      { score: "50", value: "second value" },
      { score: "150", value: "third value" },
    ]);
    expect(result.ttl).toEqual(-1);
    expect(result.key).toEqual("my:zset");
    expect(result.type).toEqual("zset");
  });
});
