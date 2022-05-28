import Redis from "ioredis";
import { RedisMemoryServer } from "redis-memory-server";

import { SetManager } from "./index";

describe("SetManager", () => {
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
    const instance = new SetManager(redis);
    await instance.set("my:set", ["1", "2", "3"]);

    const result = await redis.smembers("my:set");

    expect(result).toBeDefined();
    expect(result.length).toEqual(3);
    expect(result).toEqual(["1", "2", "3"]);
  });

  it("Should get a key", async () => {
    const instance = new SetManager(redis);
    const result = await instance.get("my:set");

    expect(result).toBeDefined();
    expect(result.value).toEqual(["1", "2", "3"]);
    expect(result.ttl).toEqual(-1);
    expect(result.key).toEqual("my:set");
    expect(result.type).toEqual("set");
  });

  it("Should update a key", async () => {
    const instance = new SetManager(redis);
    const result = await instance.set("my:set", ["4"]);

    expect(result).toBeDefined();
    expect(result.value.sort()).toEqual(["1", "2", "3", "4"]);
    expect(result.ttl).toEqual(-1);
    expect(result.key).toEqual("my:set");
    expect(result.type).toEqual("set");
  });
});
