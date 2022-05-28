import { RedisMemoryServer } from "redis-memory-server";

import { Manager } from "./manager";

describe("Database", () => {
  const manager = new Manager();
  const redisServer = new RedisMemoryServer();
  let host: string;
  let port: number;

  beforeAll(async () => {
    host = await redisServer.getHost();
    port = await redisServer.getPort();
  });

  afterAll(async () => {
    await redisServer.stop();
  });

  it("Should start", async () => {
    await manager.connect(`redis://${host}:${port}`);

    expect(manager).toBeDefined();
    expect(await manager.isConnected()).toBe(true);
  });
});
