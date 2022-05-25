import Redis from "ioredis";
import { RedisMemoryServer } from "redis-memory-server";

import { StringManager } from "./index";

describe("StringManager", () => {
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
    const instance = new StringManager(redis);
    await instance.set("my:string", "this is a string");

    const result = await redis.get("my:string");

    expect(result).toBeDefined();
    expect(result).toEqual("this is a string");
  });

  it("Should get a key", async () => {
    const instance = new StringManager(redis);
    const result = await instance.get("my:string");

    expect(result).toBeDefined();
    expect(result.value).toEqual("this is a string");
    expect(result.ttl).toEqual(-1);
    expect(result.key).toEqual("my:string");
    expect(result.type).toEqual("string");
  });

  it("Should update a key", async () => {
    const instance = new StringManager(redis);
    const result = await instance.update("my:string", "this is other string");

    expect(result).toBeDefined();
    expect(result.value).toEqual("this is other string");
    expect(result.ttl).toEqual(-1);
    expect(result.key).toEqual("my:string");
    expect(result.type).toEqual("string");
  });
});
