import Redis from "ioredis";

import {
  Item,
  ItemType,
  KeyManager,
  KeyUpdate,
  ZSetType,
} from "../database.dto";

export class ZSetManager implements KeyManager<ZSetType> {
  constructor(public redis = new Redis({ lazyConnect: true })) {}

  private marshall(range: string[]): ZSetType {
    const value: ZSetType = [];

    range.forEach((item, index) => {
      if (index % 2 === 1) return;

      value.push({
        value: item,
        score: range[index + 1],
      });
    });

    return value;
  }

  private unmarshall(input: ZSetType): string[] {
    return input.reduce(
      (prev, curr) => [...prev, curr.score, curr.value],
      [] as string[]
    );
  }

  public async set(
    key: string,
    value: ZSetType,
    update?: KeyUpdate
  ): Promise<Item<ZSetType>> {
    const args = this.unmarshall(value);

    if (update?.oldValue) await this.redis.zrem(key, update?.oldValue);
    await this.redis.zadd(key, "NX", ...args);

    return this.get(key);
  }

  public async get(key: string): Promise<Item<ZSetType>> {
    const range = await this.redis.zrange(key, 0, -1, "WITHSCORES");

    return {
      key,
      value: this.marshall(range),
      ttl: -1,
      type: ItemType.ZSET,
    };
  }

  public async del(key: string, name: string): Promise<Item<ZSetType>> {
    await this.redis.zrem(key, name);
    return this.get(key);
  }

  public async create(key: string): Promise<Item<ZSetType>> {
    return this.set(key, [{ score: "100", value: "value" }]);
  }
}
