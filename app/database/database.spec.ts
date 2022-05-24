import { RedisMemoryServer } from "redis-memory-server";

import DatabaseManager from "./index";

describe("Database", () => {
  const database = new DatabaseManager();
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
    await database.connect(host, port);

    expect(database).toBeDefined();
    expect(await database.isConnected()).toBe(true);
  });
});
