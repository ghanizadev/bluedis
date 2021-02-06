/* eslint-disable @typescript-eslint/no-explicit-any */
import Redis from "ioredis";
import { v4 } from "uuid";

class DatabaseManager {
  private _instance: Redis.Redis;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  public connect(
    host = "localhost",
    port = 6379,
    password?: string,
    tls?: {
      ca: string;
    }
  ): void {
    this._instance = new Redis(port, host, {
      password,
      tls,
    });
  }

  public disconnect(): void {
    this._instance.quit();
  }

  public deleteKey = async (key: string | string[]): Promise<number> => {
    return new Promise((res, rej) => {
      this._instance.del(key, (err, reply) => {
        if (err) return rej(err);
        return res(reply);
      });
    });
  };

  public selectDatabase = async (db: number): Promise<string> => {
    return new Promise((res, rej) => {
      this._instance.select(db, (err, reply) => {
        if (err) return rej(err);
        return res(reply);
      });
    });
  };

  public async addTTL(key: string, ttl: number | string): Promise<void> {
    return new Promise((res, rej) => {
      if (ttl) {
        if (typeof ttl === "string") {
          this._instance.pexpireat(key, new Date(ttl).getTime(), (err) => {
            if (err) rej(err);
            else res();
          });
        } else {
          this._instance.expire(key, ttl, (err) => {
            if (err) rej(err);
            else res();
          });
        }
      } else res();
    });
  }

  public async removeTTL(key: string): Promise<void> {
    return new Promise((res, rej) => {
      this._instance.persist(key, (err) => {
        if (err) rej(err);
        else res();
      });
    });
  }

  public async changeString(
    key: string,
    value: string,
    ttl: string | number
  ): Promise<void> {
    return new Promise((res, rej) => {
      this._instance.set(key, value, (err) => {
        if (err) rej(err);
        else this.addTTL(key, ttl).then(res);
      });
    });
  }

  public async changeSet(
    key: string,
    value: string,
    ttl: string | number
  ): Promise<void> {
    return new Promise((res, rej) => {
      this._instance.sadd(key, value, (err) => {
        if (err) rej(err);
        else this.addTTL(key, ttl).then(res);
      });
    });
  }

  public async changeZSet(
    key: string,
    items: { score: string; value: string }[],
    ttl: number | string
  ): Promise<void> {
    return new Promise((res, rej) => {
      this._instance.zadd(
        key,
        items.reduce(
          (prev, curr) => [...prev, curr.score, curr.value],
          new Array<string>()
        ),
        (err) => {
          if (err) rej(err);
          else this.addTTL(key, ttl).then(res);
        }
      );
    });
  }

  public async changeHash(
    key: string,
    values: { [key: string]: string | number | boolean | Date },
    ttl: number | string
  ): Promise<void> {
    return new Promise((res, rej) => {
      const items = Object.keys(values).reduce(
        (prev, curr) => [...prev, curr, String(values[curr])],
        Array<string>()
      );

      this._instance.hset(key, items, (err) => {
        if (err) rej(err);
        else this.addTTL(key, ttl).then(res);
      });
    });
  }

  public async changeList(
    key: string,
    value: string,
    ttl: string | number
  ): Promise<void> {
    return new Promise((res, rej) => {
      this._instance.lpush(key, value, (err) => {
        if (err) rej(err);
        else this.addTTL(key, ttl).then(res);
      });
    });
  }

  public async addListMember(
    key: string,
    value: string,
    position: "tail" | "head" = "tail"
  ): Promise<void> {
    return new Promise((res, rej) => {
      if (position === "head") {
        this._instance.lpush(key, value, (err) => {
          if (err) rej(err);
          return res();
        });
      } else {
        this._instance.rpush(key, value, (err) => {
          if (err) rej(err);
          return res();
        });
      }
    });
  }

  public async removeListMember(key: string, index: number): Promise<void> {
    return new Promise((res, rej) => {
      const uuid = v4();
      this._instance.lset(key, index, uuid, (err) => {
        if (err) rej(err);

        this._instance.lrem(key, 1, uuid, (err) => {
          if (err) rej(err);
          return res();
        });
      });
    });
  }

  public async alterListMember(
    key: string,
    value: string,
    index: number
  ): Promise<void> {
    return new Promise((res, rej) => {
      this._instance.lset(key, index, value, (err) => {
        if (err) rej(err);
        res();
      });
    });
  }

  public async addSetMember(key: string, value: string): Promise<void> {
    return new Promise((res, rej) => {
      this._instance.sadd(key, value, (err) => {
        if (err) rej(err);
        return res();
      });
    });
  }

  public async removeSetMember(key: string, value: string): Promise<void> {
    return new Promise((res, rej) => {
      this._instance.srem(key, value, (err) => {
        if (err) rej(err);
        return res();
      });
    });
  }

  public async addZSetMember(
    key: string,
    value: string,
    score = "0"
  ): Promise<void> {
    return new Promise((res, rej) => {
      this._instance.zadd(key, [score, value], (err) => {
        if (err) rej(err);
        return res();
      });
    });
  }

  public async removeZSetMember(key: string, value: string): Promise<void> {
    return new Promise((res, rej) => {
      this._instance.zrem(key, value, (err) => {
        if (err) rej(err);
        return res();
      });
    });
  }

  public async addHashMember(
    key: string,
    values: { [key: string]: string | number | boolean | Date }
  ): Promise<void> {
    return new Promise((res, rej) => {
      const items = Object.keys(values).reduce(
        (prev, curr) => [...prev, curr, String(values[curr])],
        Array<string>()
      );

      this._instance.hset(key, items, (err) => {
        if (err) rej(err);
        return res();
      });
    });
  }

  public async removeHashMember(key: string, value: string): Promise<void> {
    return new Promise((res, rej) => {
      this._instance.hdel(key, value, (err) => {
        if (err) rej(err);
        return res();
      });
    });
  }

  public async addKey(
    key: string,
    type: "set" | "zset" | "hash" | "string" | "list",
    ttl: number
  ): Promise<void> {
    switch (type) {
      case "string":
        await this.changeString(key, "New Value", ttl);
        break;
      case "set":
        await this.changeSet(key, "New Member", ttl);
        break;
      case "zset":
        await this.changeZSet(key, [{ score: "0", value: "New Member" }], ttl);
        break;
      case "hash":
        await this.changeHash(key, { "New Item": "New Member" }, ttl);
        break;
      case "list":
        await this.changeList(key, "New Member", ttl);
        break;
      default:
        throw new Error("not impemented");
    }
  }

  private async hydratateShallow(items: string[]) {
    const promises = items.map(async (item) => {
      const response: any = {
        key: item,
        value: "",
        type: "",
        ttl: -1,
      };

      const type = await new Promise((res) => {
        this._instance.type(item, (err, reply) => {
          res(reply);
        });
      });

      response.type = type;

      return response;
    });

    return Promise.all(promises);
  }

  private async hydrateItems(items: string[]): Promise<any[]> {
    const promises = items.map(async (item) => {
      const response: any = {
        key: item,
        value: "",
        type: "",
        ttl: -1,
      };

      const type = await new Promise((res) => {
        this._instance.type(item, (err, reply) => {
          res(reply);
        });
      });

      const value = await new Promise((res) => {
        if (type === "string") {
          this._instance.get(item, (err, reply) => {
            res(reply);
          });
        } else if (type === "hash") {
          this._instance.hgetall(item, (err, reply) => {
            res(reply);
          });
        } else if (type === "set") {
          this._instance.smembers(item, (err, reply) => {
            res(reply);
          });
        } else if (type === "list") {
          this._instance.lrange(item, 0, -1, (err, reply) => {
            res(reply);
          });
        } else if (type === "zset") {
          this._instance.zrange(item, 0, -1, "WITHSCORES", (err, reply) => {
            const result: { value: string; score: string }[] = [];

            reply.forEach((item, index) => {
              if (index % 2 === 1) return;

              result.push({
                value: item,
                score: reply[index + 1],
              });
            });
            res(result);
          });
        }
      });

      const ttl = await new Promise((res, rej) => {
        this._instance.pttl(item, (err, ttl) => {
          if (err) rej(err);

          if (ttl === -1) return res(-1);
          return res(new Date(Date.now() + ttl).getTime());
        });
      });

      response.value = value;
      response.type = type;
      response.ttl = ttl;

      return response;
    });

    return Promise.all(promises);
  }

  public async countDocuments(): Promise<number> {
    return new Promise((res, rej) => {
      this._instance.dbsize((err, reply) => {
        if (err) return rej(err);
        return res(reply);
      });
    });
  }

  public async loadMore(
    match: string,
    cursor = 0
    // count = 10
  ): Promise<{ docs: any[]; cursor: number }> {
    return await new Promise((res, rej) => {
      this._instance.scan(cursor, "MATCH", match, async (err, reply) => {
        if (err) rej(err);

        const [replycursor, items] = reply;
        const response = await this.hydratateShallow(items);
        res({
          docs: response,
          cursor: Number(replycursor),
        });
      });
    });
  }

  public async findByName(
    match: string
  ): Promise<{ docs: any[]; cursor: number; totalDocs: number }> {
    return await new Promise((res, rej) => {
      this._instance.scan(0, "MATCH", match, async (err, reply) => {
        if (err) rej(err);

        const [cursor, items] = reply;
        const response = await this.hydratateShallow(items);
        res({
          docs: response,
          cursor: Number(cursor),
          totalDocs: items.length,
        });
      });
    });
  }

  public async findAll(
    cursor = 0
    // count = 10
  ): Promise<{ docs: any[]; cursor: number; totalDocs: number }> {
    return await new Promise((res, rej) => {
      this._instance.scan(cursor, "MATCH", "*", async (err, reply) => {
        if (err) rej(err);

        const totalCount = await this.countDocuments();
        const [replycursor, items] = reply;
        const response = await this.hydratateShallow(items);
        res({
          docs: response,
          cursor: Number(replycursor),
          totalDocs: totalCount,
        });
      });
    });
  }

  public async findByKeys(keys: string[]): Promise<any> {
    return this.hydrateItems(keys);
  }
}

export default DatabaseManager;
