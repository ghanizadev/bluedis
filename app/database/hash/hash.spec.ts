import Redis from "ioredis";
import { RedisMemoryServer } from "redis-memory-server";

import { HashManager } from "./index";

describe("HashManager", () => {
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
    const instance = new HashManager(redis);
    await instance.set("my:hash", { message: "hello world!" });

    const result = await redis.hgetall("my:hash");
    expect(result).toBeDefined();
    expect(result.message).toEqual("hello world!");
  });

  it("Should get a key", async () => {
    const instance = new HashManager(redis);
    const result = await instance.get("my:hash");

    expect(result).toBeDefined();
    expect(result.value.message).toEqual("hello world!");
    expect(result.type).toEqual("hash");
    expect(result.ttl).toEqual(-1);
    expect(result.key).toEqual("my:hash");
  });

  it("Should update key", async () => {
    const instance = new HashManager(redis);
    const result = await instance.set("my:hash", { another: "msg" });

    expect(result).toBeDefined();
    expect(result.value.message).toEqual("hello world!");
    expect(result.value.another).toEqual("msg");
    expect(result.type).toEqual("hash");
    expect(result.ttl).toEqual(-1);
    expect(result.key).toEqual("my:hash");
  });
});
