import Redis from "ioredis";
import { v4 } from "uuid";

import {
  Item,
  ItemType,
  KeyManager,
  KeyUpdate,
  ListType,
} from "../database.dto";

export class ListManager implements KeyManager<ListType> {
  constructor(public redis = new Redis({ lazyConnect: true })) {}

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

    return {
      key,
      value,
      ttl: -1,
      type: ItemType.LIST,
    };
  }

  private async update(
    key: string,
    value: ListType,
    payload: KeyUpdate
  ): Promise<Item<ListType>> {
    if (payload.index) {
      const item = value.pop();

      if (!item) throw new Error("Impossible to replace an empty list");
      await this.redis.lset(key, payload.index, item);
    } else {
      if (payload.position === "tail") await this.redis.rpush(key, ...value);
      else await this.redis.lpush(key, ...value);
    }
    return this.get(key);
  }

  public async del(
    key: string,
    indexOrName: number | string
  ): Promise<Item<ListType>> {
    let toBeRemoved = indexOrName;

    if (typeof indexOrName === "number") {
      toBeRemoved = v4();
      await this.redis.lset(key, indexOrName, toBeRemoved);
    }

    await this.redis.lrem(key, 1, toBeRemoved);

    return this.get(key);
  }

  public async create(key: string): Promise<Item<ListType>> {
    return this.set(key, ["value"]);
  }
}
