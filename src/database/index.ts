import redis, { RedisClient } from "redis";
import { v4 } from "uuid";
import availableCommands from "./availableCommands.json";

type DBResponse =
  | string
  | string[]
  | { [key: string]: string }
  | { value: string; score: string }[];
class DatabaseManager {
  private _instance: RedisClient;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  public connect(
    host = "localhost",
    port = 6379,
    password?: string,
    tls?: {
      ca: Buffer | string;
    }
  ): void {
    this._instance = redis.createClient(port, host, {
      auth_pass: password,
      retry_strategy: () => new Error("Host unreacheable"),
      tls,
    });
  }

  public disconnect(): void {
    this._instance.quit();
    this._instance.unref();
  }

  public command = async (command: string): Promise<any> => {
    return new Promise<any>((res, rej) => {
      try{
        const c = (availableCommands as string[]).find((str) =>
          command.toUpperCase().startsWith(str)
        );
  
        if (!c) return rej("Command not found");
  
        const query = [c, ...command.slice(c.length).trim().split(" ").filter(i => i !== "")];
  
        console.log(query);
  
        this._instance.batch([query]).exec((err, reply) => {
          if (err) return rej(err);
          return res(reply);
        });
        
      }catch(e){
        console.error(e)
      }
    });
  };

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
          this._instance.PEXPIREAT(key, new Date(ttl).getTime(), (err) => {
            if (err) rej(err);
            else res();
          });
        } else {
          this._instance.EXPIRE(key, ttl, (err) => {
            if (err) rej(err);
            else res();
          });
        }
      } else res();
    });
  }

  public async removeTTL(key: string): Promise<void> {
    return new Promise((res, rej) => {
      this._instance.PERSIST(key, (err) => {
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
      this._instance.SET(key, value, (err) => {
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
      this._instance.SADD(key, value, (err) => {
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
      this._instance.ZADD(
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

      this._instance.HSET(key, items, (err) => {
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
      this._instance.LPUSH(key, value, (err) => {
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
        this._instance.LPUSH(key, value, (err) => {
          if (err) rej(err);
          return res();
        });
      } else {
        this._instance.RPUSH(key, value, (err) => {
          if (err) rej(err);
          return res();
        });
      }
    });
  }

  public async removeListMember(key: string, index: number): Promise<void> {
    return new Promise((res, rej) => {
      const uuid = v4();
      this._instance.LSET(key, index, uuid, (err) => {
        if (err) rej(err);

        this._instance.LREM(key, 1, uuid, (err) => {
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
      this._instance.LSET(key, index, value, (err) => {
        if (err) rej(err);
        res();
      });
    });
  }

  public async addSetMember(key: string, value: string): Promise<void> {
    return new Promise((res, rej) => {
      this._instance.SADD(key, value, (err) => {
        if (err) rej(err);
        return res();
      });
    });
  }

  public async removeSetMember(key: string, value: string): Promise<void> {
    return new Promise((res, rej) => {
      this._instance.SREM(key, value, (err) => {
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
      this._instance.ZADD(key, [score, value], (err) => {
        if (err) rej(err);
        return res();
      });
    });
  }

  public async removeZSetMember(key: string, value: string): Promise<void> {
    return new Promise((res, rej) => {
      this._instance.ZREM(key, value, (err) => {
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

      this._instance.HSET(key, items, (err) => {
        if (err) rej(err);
        return res();
      });
    });
  }

  public async removeHashMember(key: string, value: string): Promise<void> {
    return new Promise((res, rej) => {
      this._instance.HDEL(key, value, (err) => {
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
      const response = {
        key: item,
        value: "",
        type: "",
        ttl: -1,
      };

      const type = await new Promise<string>((res) => {
        this._instance.TYPE(item, (err, reply) => {
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
      const response: {
        key: string;
        value: DBResponse;
        type: string;
        ttl: number;
      } = {
        key: item,
        value: "",
        type: "",
        ttl: -1,
      };

      const type = await new Promise<string>((res) => {
        this._instance.TYPE(item, (err, reply) => {
          res(reply);
        });
      });

      const value = await new Promise<DBResponse>((res) => {
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

      const ttl = await new Promise<number>((res, rej) => {
        this._instance.PTTL(item, (err, ttl) => {
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
      this._instance.DBSIZE((err, reply) => {
        if (err) return rej(err);
        return res(reply);
      });
    });
  }

  public async loadMore(
    match: string,
    cursor = 0,
    count = 10
  ): Promise<{ docs: any[]; cursor: number }> {
    return await new Promise((res, rej) => {
      this._instance.SCAN(
        String(cursor),
        "MATCH",
        match,
        "COUNT",
        String(count),
        async (err, reply) => {
          if (err) rej(err);

          const [replycursor, items] = reply;
          const response = await this.hydratateShallow(items);
          res({
            docs: response,
            cursor: Number(replycursor),
          });
        }
      );
    });
  }

  public async findByName(
    match: string
  ): Promise<{ docs: any[]; cursor: number; totalDocs: number }> {
    return await new Promise((res, rej) => {
      this._instance.KEYS(match, async (err, reply) => {
        if (err) rej(err);

        const items = reply;
        const response = await this.hydratateShallow(items);
        res({
          docs: response,
          cursor: 0,
          totalDocs: items.length,
        });
      });
    });
  }

  public async findAll(
    cursor = 0,
    count = 10
  ): Promise<{ docs: any[]; cursor: number; totalDocs: number }> {
    return await new Promise((res, rej) => {
      this._instance.scan(
        String(cursor),
        "COUNT",
        String(count),
        async (err, reply) => {
          if (err) rej(err);

          const totalCount = await this.countDocuments();
          const [replycursor, items] = reply;
          const response = await this.hydratateShallow(items);
          res({
            docs: response,
            cursor: Number(replycursor),
            totalDocs: totalCount,
          });
        }
      );
    });
  }

  public async findByKeys(keys: string[]): Promise<any[]> {
    return this.hydrateItems(keys);
  }
}

export default DatabaseManager;
