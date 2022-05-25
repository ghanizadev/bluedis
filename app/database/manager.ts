import Redis from "ioredis";

import { ZSetManager } from "./zset";
import { SetManager } from "./set";
import { StringManager } from "./string";
import { HashManager } from "./hash";
import { ListManager } from "./list";

export class Manager {
  private redis: Redis = new Redis({ lazyConnect: true });

  private zsetManager: ZSetManager;
  private setManager: SetManager;
  private stringManager: StringManager;
  private hashManager: HashManager;
  private listManager: ListManager;

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

  // public async find(match: string, cursor = 0) {}
  //
  // public async count() {}
  //
  // public async getKey(key: string) {}
  //
  // public async setKey(key: string, payload: any) {}
  //
  // public async updateKey(key: string, payload: any, scoreOrIndex?: string) {}
}
