import Redis from "ioredis";

import {
  Item,
  ItemType,
  KeyManager,
  KeyUpdate,
  SetType,
} from "../database.dto";

export class SetManager implements KeyManager<SetType> {
  constructor(public redis = new Redis({ lazyConnect: true })) {}

  public async set(
    key: string,
    value: SetType,
    update?: KeyUpdate
  ): Promise<Item<SetType>> {
    if (update?.oldValue) await this.redis.srem(key, update.oldValue);

    await this.redis.sadd(key, ...value);
    return this.get(key);
  }

  public async get(key: string): Promise<Item<SetType>> {
    const value = await this.redis.smembers(key);
    const ttl = await this.redis.pttl(key);

    return {
      key,
      value,
      ttl,
      type: ItemType.SET,
    };
  }

  public async del(key: string, name: string): Promise<Item<SetType>> {
    await this.redis.srem(key, name);
    return this.get(key);
  }

  public async create(key: string): Promise<Item<SetType>> {
    return this.set(key, ["value"]);
  }
}
