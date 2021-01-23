export interface Item {
  type: "zset" | "string" | "set" | "list" | "hash",
  value: any;
  key: string;
  ttl: number
}