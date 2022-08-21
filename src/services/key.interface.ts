export type KeyType = "string" | "set" | "zset" | "hash" | "list";

export interface RawKey {
  is_new: boolean;
  key: string;
  key_type: KeyType;
  ttl: number;
  value: string;
}
