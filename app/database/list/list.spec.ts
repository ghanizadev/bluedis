import Redis from "ioredis";
import { RedisMemoryServer } from "redis-memory-server";

import { ListManager } from "./index";

describe("ListManager", () => {
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
    const instance = new ListManager(redis);
    await instance.set("my:list", ["first", "second", "third"]);

    const result = await redis.lrange("my:list", 0, -1);

    expect(result).toBeDefined();
    expect(result.length).toEqual(3);
    expect(result).toEqual(["first", "second", "third"]);
  });

  it("Should get a key", async () => {
    const instance = new ListManager(redis);
    const result = await instance.get("my:list");

    expect(result).toBeDefined();
    expect(result.value).toEqual(["first", "second", "third"]);
    expect(result.ttl).toEqual(-1);
    expect(result.key).toEqual("my:list");
    expect(result.type).toEqual("list");
  });

  // it("Should update a key - head", async () => {
  //   const instance = new ListManager(redis);
  //   const result = await instance.update("my:list", {
  //     value: "another one",
  //     position: "head",
  //   });
  //
  //   expect(result).toBeDefined();
  //   expect(result.value).toEqual(["another one", "first", "second", "third"]);
  //   expect(result.ttl).toEqual(-1);
  //   expect(result.key).toEqual("my:list");
  //   expect(result.type).toEqual("list");
  // });
  //
  // it("Should update a key - tail", async () => {
  //   const instance = new ListManager(redis);
  //   const result = await instance.update("my:list", {
  //     value: "one more",
  //     position: "tail",
  //   });
  //
  //   expect(result).toBeDefined();
  //   expect(result.value).toEqual([
  //     "another one",
  //     "first",
  //     "second",
  //     "third",
  //     "one more",
  //   ]);
  //   expect(result.ttl).toEqual(-1);
  //   expect(result.key).toEqual("my:list");
  //   expect(result.type).toEqual("list");
  // });
});
