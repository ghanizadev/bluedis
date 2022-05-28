import Redis from "ioredis";

import {
  Item,
  ItemType,
  KeyManager,
  KeyUpdate,
  ListType,
} from "../database.dto";

export class ListManager implements KeyManager<ListType> {
  constructor(public redis: Redis) {}

  public async set(
    key: string,
    value: ListType,
    update?: KeyUpdate
  ): Promise<Item<ListType>> {
    if (update) return this.update(key, value, update);

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

  private async update(
    key: string,
    value: ListType,
    payload: KeyUpdate
  ): Promise<Item<ListType>> {
    if (payload.position === "tail") await this.redis.rpush(key, ...value);
    else await this.redis.lpush(key, ...value);
    return this.get(key);
  }

  public async del(key: string, name: string): Promise<Item<ListType>> {
    await this.redis.lrem(key, 1, name);
    return this.get(key);
  }
}
