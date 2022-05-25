import Redis from "ioredis";

import { Item, ItemType, KeyManager, StringType } from "../database.dto";

export class StringManager implements KeyManager<StringType> {
  constructor(public redis: Redis) {}

  public async set(key: string, value: StringType): Promise<Item<StringType>> {
    await this.redis.set(key, value);
    return this.get(key);
  }

  public async get(key: string): Promise<Item<StringType>> {
    const value = (await this.redis.get(key)) ?? "";
    const ttl = await this.redis.pttl(key);

    return {
      key,
      value,
      ttl,
      type: ItemType.STRING,
    };
  }

  public async update(key: string, payload: string): Promise<Item<StringType>> {
    return this.set(key, payload);
  }
}
