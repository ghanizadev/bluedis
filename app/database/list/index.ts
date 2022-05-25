import Redis from "ioredis";

import { Item, ItemType, KeyManager, ListType } from "../database.dto";

export class ListManager implements KeyManager<ListType> {
  constructor(public redis: Redis) {}

  public async set(key: string, value: ListType): Promise<Item<ListType>> {
    await this.redis.rpush(key, ...value);
    return this.get(key);
  }

  public async get(key: string): Promise<Item<ListType>> {
    const value = await this.redis.lrange(key, 0, -1);
    const ttl = await this.redis.pttl(key);

    return {
      key,
      value,
      ttl,
      type: ItemType.LIST,
    };
  }

  public async update(
    key: string,
    payload: { value: string; position: "head" | "tail" }
  ): Promise<Item<ListType>> {
    if (payload.position === "tail") await this.redis.rpush(key, payload.value);
    else await this.redis.lpush(key, payload.value);
    return this.get(key);
  }
}
