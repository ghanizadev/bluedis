import Redis from "ioredis";

import { Item, ItemType, KeyManager, ListType } from "../database.dto";

export class SetManager implements KeyManager<ListType> {
  constructor(public redis: Redis) {}

  public async set(key: string, value: ListType): Promise<Item<ListType>> {
    await this.redis.sadd(key, ...value);
    return this.get(key);
  }

  public async get(key: string): Promise<Item<ListType>> {
    const value = await this.redis.smembers(key);
    const ttl = await this.redis.pttl(key);

    return {
      key,
      value,
      ttl,
      type: ItemType.SET,
    };
  }

  public async del(key: string, name: string): Promise<Item<ListType>> {
    await this.redis.srem(key, name);
    return this.get(key);
  }
}
