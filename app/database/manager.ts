import Redis from "ioredis";

import { ZSetManager } from "./zset";
import { SetManager } from "./set";
import { StringManager } from "./string";
import { HashManager } from "./hash";
import { ListManager } from "./list";
import { AnyItem, KeyUpdate, SearchResult } from "./database.dto";

export class Manager {
  private redis: Redis = new Redis({ lazyConnect: true });

  private readonly zsetManager: ZSetManager;
  private readonly setManager: SetManager;
  private readonly stringManager: StringManager;
  private readonly hashManager: HashManager;
  private readonly listManager: ListManager;

  constructor() {
    this.zsetManager = new ZSetManager(this.redis);
    this.setManager = new SetManager(this.redis);
    this.stringManager = new StringManager(this.redis);
    this.hashManager = new HashManager(this.redis);
    this.listManager = new ListManager(this.redis);
  }

  public async connect(connectionString: string) {
    this.redis = new Redis(connectionString, {
      retryStrategy: (times) => {
        if (times > 3) throw new Error("timeout");
      },
      maxRetriesPerRequest: 3,
      keepAlive: 5,
    });

    this.zsetManager.redis = this.redis;
    this.setManager.redis = this.redis;
    this.stringManager.redis = this.redis;
    this.hashManager.redis = this.redis;
    this.listManager.redis = this.redis;
  }

  public async disconnect() {
    this.redis.disconnect();
  }

  public async setTTL(key: string, ttl: number) {
    if (ttl < 0) await this.redis.persist(key);
    await this.redis.pexpire(key, ttl);
  }

  public async remove(key: string[]) {
    await this.redis.del(key);
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

      const [replyCursor, items] = await this.redis.scan(
        newCursor,
        "MATCH",
        match,
        "COUNT",
        10
      );
      newCursor = +replyCursor;
      resultItems = [...resultItems, ...items];
    }

    const response: AnyItem[] = await Promise.all(
      resultItems.map(this.getKey.bind(this))
    );

    return {
      cursor: newCursor,
      docs: response,
      input: match,
      count: resultItems.length,
      done: newCursor === 0,
    };
  }

  public async count() {
    return this.redis.dbsize();
  }

  public async getKey(key: string) {
    return this.switchType(key, "get");
  }

  public async setKey(key: string, payload: any, update?: KeyUpdate) {
    return this.switchType(key, "set", payload, update);
  }

  public async remKey(key: string, indexOrName: string | number) {
    return this.switchType(key, "del", indexOrName);
  }

  private async switchType(
    key: string,
    callback: "get" | "set" | "del",
    ...args: any[]
  ): Promise<any> {
    const type = await this.redis.type(key);

    switch (type) {
      case "string":
        return this.stringManager[callback].call(this.stringManager, ...args);
      case "set":
        return this.setManager[callback].call(this.setManager, ...args);
      case "zset":
        return this.zsetManager[callback].call(this.zsetManager, ...args);
      case "list":
        return this.listManager[callback].call(this.listManager, ...args);
      case "hash":
        return this.hashManager[callback].call(this.hashManager, ...args);
      default:
        throw new Error("not implemented");
    }
  }
}
