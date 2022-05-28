export interface Item<T> {
  type: "zset" | "string" | "set" | "list" | "hash";
  value: T;
  key: string;
  ttl: number;
}

export type ItemType =
  | Item<ZSetType>
  | Item<ListType>
  | Item<StringType>
  | Item<HashType>
  | Item<SetType>;

export type ListType = Array<string>;

export type SetType = Array<string>;

export type StringType = string;

export type HashType = { [key: string]: string };

export type ZSetType = { value: string; score: string }[];
