import Redis from "ioredis";

import { ZSetManager } from "./zset";
import { SetManager } from "./set";
import { StringManager } from "./string";
import { HashManager } from "./hash";
import { ListManager } from "./list";
import { AnyItem, KeyUpdate, SearchResult } from "./database.dto";
import { CommandManager } from "./command";

export class Manager {
  private redis = new Redis({ lazyConnect: true });

  constructor(
    private readonly zsetManager = new ZSetManager(),
    private readonly setManager = new SetManager(),
    private readonly strManager = new StringManager(),
    private readonly hashManager = new HashManager(),
    private readonly listManager = new ListManager(),
    private readonly commandManager = new CommandManager()
  ) {}

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
    this.strManager.redis = this.redis;
    this.hashManager.redis = this.redis;
    this.listManager.redis = this.redis;
    this.commandManager.redis = this.redis;
  }

  public async disconnect() {
    this.redis.disconnect();
  }

  public async isConnected() {
    return (await this.redis.ping()) === "PONG";
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

  public async selectDB(index: number) {
    return this.redis.select(index);
  }

  public async createKey(key: string, type: string) {
    return this.switchType(key, type, "create");
  }

  public async getKey(key: string) {
    return this.switchType(key, "", "get");
  }

  public async setKey(key: string, payload: any, update?: KeyUpdate) {
    return this.switchType(key, "", "set", payload, update);
  }

  public async remKey(key: string, indexOrName: string | number) {
    return this.switchType(key, "", "del", indexOrName);
  }

  public async command(command: string) {
    return this.commandManager.call(command);
  }

  private async switchType(
    key: string,
    type: string,
    callback: "get" | "set" | "del" | "create",
    ...args: any[]
  ): Promise<any> {
    const t = type ? type : await this.redis.type(key);

    switch (t) {
      case "string":
        return this.strManager[callback].call(this.strManager, key, ...args);
      case "set":
        return this.setManager[callback].call(this.setManager, key, ...args);
      case "zset":
        return this.zsetManager[callback].call(this.zsetManager, key, ...args);
      case "list":
        return this.listManager[callback].call(this.listManager, key, ...args);
      case "hash":
        return this.hashManager[callback].call(this.hashManager, key, ...args);
      default:
        throw new Error("not implemented");
    }
  }
}
