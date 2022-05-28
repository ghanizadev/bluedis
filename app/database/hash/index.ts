import Redis from "ioredis";

import { Item, ItemType, KeyManager, HashType } from "../database.dto";

export class HashManager implements KeyManager<HashType> {
  constructor(public redis: Redis) {}

  private unmarshall(input: HashType): string[] {
    return Object.entries(input).reduce(
      (prev, [key, value]) => [...prev, key, value],
      [] as string[]
    );
  }

  public async set(key: string, value: HashType): Promise<Item<HashType>> {
    const args = this.unmarshall(value);
    await this.redis.hset(key, ...args);

    return this.get(key);
  }

  public async get(key: string): Promise<Item<HashType>> {
    const value = await this.redis.hgetall(key);
    const ttl = await this.redis.pttl(key);

    return {
      key,
      value,
      ttl,
      type: ItemType.HASH,
    };
  }

  public async del(key: string, indexOrName: string): Promise<Item<HashType>> {
    await this.redis.hdel(key, indexOrName);
    return this.get(key);
  }
}
