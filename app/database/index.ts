import Redis from "ioredis";
import { v4 } from "uuid";

import availableCommands from "./availableCommands.json";
import { DEFAULT_ITEM } from "./database.constants";
import { parseZSet } from "./database.helpers";
import { AnyItem, ItemType, SearchResult } from "./database.dto";

class DatabaseManager {
  private _instance: Redis = new Redis({ lazyConnect: true });

  public connect(
    host = "localhost",
    port = 6379,
    password?: string,
    tls = false
  ): void {
    this._instance = new Redis(
      `redis${tls ? "s" : ""}://:${password}@${host}:${port}`,
      {
        retryStrategy: (times) => {
          if (times > 3) throw new Error("timeout");
        },
        maxRetriesPerRequest: 3,
        keepAlive: 5,
      }
    );
  }

  public async isConnected() {
    return (await this._instance.ping()) === "PONG";
  }

  public disconnect(): void {
    this._instance.quit();
  }

  public command = async (command: string): Promise<unknown> => {
    const c = (availableCommands as string[]).find((str) =>
      command.toLowerCase().startsWith(str)
    );

    if (!c) throw new Error("Command not found");

    return this._instance.call(
      c,
      ...command
        .slice(c.length)
        .trim()
        .split(" ")
        .filter((i) => i !== "")
    );
  };

  public deleteKey = async (key: string | string[]): Promise<number> => {
    const args: string[] = Array.isArray(key) ? key : [key];
    return this._instance.del(args);
  };

  public selectDatabase = async (db: number): Promise<string> => {
    return this._instance.select(db);
  };

  public async addTTL(key: string, ttl: number | string): Promise<void> {
    if (ttl > 0) await this._instance.pexpireat(key, ttl);
  }

  public async removeTTL(key: string): Promise<void> {
    await this._instance.persist(key);
  }

  public async alterString(
    key: string,
    value: string,
    ttl: string | number
  ): Promise<void> {
    await this._instance.set(key, value);
    await this.addTTL(key, ttl);
  }

  public async changeSet(
    key: string,
    value: string,
    ttl: string | number
  ): Promise<void> {
    await this._instance.sadd(key, value);
    await this.addTTL(key, ttl);
  }

  public async changeZSet(
    key: string,
    items: { score: string; value: string }[],
    ttl: number | string
  ): Promise<void> {
    const args: string[] = items.reduce(
      (prev, curr) => [...prev, curr.score, curr.value],
      [] as string[]
    );
    await this._instance.zadd(key, ...args);
    await this.addTTL(key, ttl);
  }

  public async changeHash(
    key: string,
    values: { [key: string]: string | number | boolean | Date },
    ttl: number | string
  ): Promise<void> {
    const items = Object.keys(values).reduce(
      (prev, curr) => [...prev, curr, String(values[curr])],
      [] as string[]
    );

    await this._instance.hset(key, items);
    await this.addTTL(key, ttl);
  }

  public async changeList(
    key: string,
    value: string,
    ttl: string | number
  ): Promise<void> {
    await this._instance.lpush(key, value);
    await this.addTTL(key, ttl);
  }

  public async addListMember(
    key: string,
    value: string,
    position: "tail" | "head" = "tail"
  ): Promise<void> {
    if (position === "head") await this._instance.lpush(key, value);
    else await this._instance.rpush(key, value);
  }

  public async removeListMember(key: string, index: number): Promise<void> {
    const uuid = v4();

    await this._instance.lset(key, index, uuid);
    await this._instance.lrem(key, 1, uuid);
  }

  public async alterListMember(
    key: string,
    value: string,
    index: number
  ): Promise<void> {
    await this._instance.lset(key, index, value);
  }

  public async addSetMember(key: string, value: string): Promise<void> {
    this._instance.sadd(key, value);
  }

  public async removeSetMember(key: string, value: string): Promise<void> {
    await this._instance.srem(key, value);
  }

  public async addZSetMember(
    key: string,
    value: string,
    score = "0"
  ): Promise<void> {
    await this._instance.zadd(key, score, value);
  }

  public async removeZSetMember(key: string, value: string): Promise<void> {
    await this._instance.zrem(key, value);
  }

  public async addHashMember(
    key: string,
    values: { [key: string]: string | number | boolean | Date }
  ): Promise<void> {
    const items = Object.keys(values).reduce(
      (prev, curr) => [...prev, curr, values[curr].toString()],
      [] as string[]
    );

    await this._instance.hset(key, items);
  }

  public async removeHashMember(key: string, value: string): Promise<void> {
    await this._instance.hdel(key, value);
  }

  public async addKey(key: string, type: ItemType, ttl: number): Promise<void> {
    switch (type) {
      case ItemType.STRING:
        await this.alterString(key, "New Value", ttl);
        break;
      case ItemType.SET:
        await this.changeSet(key, "New Member", ttl);
        break;
      case ItemType.ZSET:
        await this.changeZSet(key, [{ score: "0", value: "New Member" }], ttl);
        break;
      case ItemType.HASH:
        await this.changeHash(key, { "New Item": "New Member" }, ttl);
        break;
      case ItemType.LIST:
        await this.changeList(key, "New Member", ttl);
        break;
      default:
        throw new Error("Not implemented");
    }
  }

  private async hydrateShallow(keys: string[]): Promise<AnyItem[]> {
    const promises: Promise<AnyItem>[] = keys.map(async (key) => ({
      key,
      type: (await this._instance.type(key)) as ItemType,
      value: "",
      ttl: -1,
    }));

    return Promise.all(promises);
  }

  public async findByKeys(keys: string[]): Promise<AnyItem[]> {
    const promises = keys.map(async (key) => {
      const response = DEFAULT_ITEM;

      response.key = key;
      response.type = (await this._instance.type(key)) as ItemType;
      response.ttl = await this._instance.pttl(key).then((ttl) => {
        //TODO Oh Lord, why?
        if (ttl > -1) return new Date(Date.now() + ttl).getTime();
        return ttl;
      });

      switch (response.type) {
        case ItemType.STRING:
          response.value = (await this._instance.get(key)) ?? "";
          break;
        case ItemType.HASH:
          response.value = await this._instance.hgetall(key);
          break;
        case ItemType.SET:
          response.value = await this._instance.smembers(key);
          break;
        case ItemType.LIST:
          response.value = await this._instance.lrange(key, 0, -1);
          break;
        case ItemType.ZSET:
          response.value = await this._instance.zrange(
            key,
            0,
            -1,
            "WITHSCORES"
          );
          response.value = parseZSet(response.value);
          break;
      }

      return response;
    });

    return Promise.all(promises);
  }

  public async countDocuments(): Promise<number> {
    return this._instance.dbsize();
  }

  public async find(
    match: string,
    cursor = 0,
    limit = Number.MAX_SAFE_INTEGER
  ): Promise<SearchResult> {
    let newCursor = cursor > 0 ? cursor : -1;
    let resultItems: string[] = [];

    while (newCursor !== 0 && resultItems.length <= limit) {
      if (newCursor === -1) newCursor = 0;

      const [replyCursor, items] = await this._instance.scan(
        newCursor,
        "MATCH",
        match,
        "COUNT",
        10
      );
      newCursor = +replyCursor;
      resultItems = [...resultItems, ...items];
    }

    const response = await this.hydrateShallow(resultItems);

    return {
      cursor: newCursor,
      docs: response,
      input: match,
      count: resultItems.length,
      done: newCursor === 0,
    };
  }
}

export default DatabaseManager;
