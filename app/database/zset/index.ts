import Redis from "ioredis";

import { Item, ItemType, KeyManager, ZSetType } from "../database.dto";

export class ZSetManager implements KeyManager<ZSetType> {
  constructor(public redis: Redis) {}

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

  public async set(key: string, value: ZSetType): Promise<Item<ZSetType>> {
    const args = this.unmarshall(value);
    await this.redis.zadd(key, ...args);
    return this.get(key);
  }

  public async get(key: string): Promise<Item<ZSetType>> {
    const range = await this.redis.zrange(key, 0, -1, "WITHSCORES");
    const ttl = await this.redis.pttl(key);

    return {
      key,
      value: this.marshall(range),
      ttl,
      type: ItemType.ZSET,
    };
  }

  public async update(
    key: string,
    payload: { score: string; value: string }
  ): Promise<Item<ZSetType>> {
    await this.redis.zadd(key, payload.score, payload.value);
    return this.get(key);
  }
}
