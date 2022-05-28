import Redis from "ioredis";

import { Item, ItemType, KeyManager, StringType } from "../database.dto";

export class StringManager implements KeyManager<StringType> {
  constructor(public redis = new Redis({ lazyConnect: true })) {}

  public async set(key: string, value: StringType): Promise<Item<StringType>> {
    await this.redis.set(key, value);
    return this.get(key);
  }

  public async get(key: string): Promise<Item<StringType>> {
    const value = (await this.redis.get(key)) ?? "";

    return {
      key,
      value,
      ttl: -1,
      type: ItemType.STRING,
    };
  }

  public async del(
    key: string,
    indexOrName: number | string
  ): Promise<Item<StringType>> {
    return this.get(key);
  }

  public async create(key: string): Promise<Item<StringType>> {
    return this.set(key, "value");
  }
}
