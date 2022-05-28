export type SetType = Array<string>;

export type ListType = Array<string>;

export type StringType = string;

export type HashType = { [key: string]: string };

export type ZSetType = { value: string; score: string }[];

export enum ItemType {
  ZSET = "zset",
  SET = "set",
  STRING = "string",
  HASH = "hash",
  LIST = "list",
}

export interface Item<T> {
  type: ItemType;
  value: T;
  key: string;
  ttl: number;
}

export type AnyItem =
  | Item<SetType>
  | Item<ListType>
  | Item<StringType>
  | Item<HashType>
  | Item<ZSetType>;

export type SearchResult = {
  docs: AnyItem[];
  cursor: number;
  count: number;
  input: string;
  done: boolean;
};

export interface KeyUpdate {
  index?: number;
  score?: number;
  position: "head" | "tail";
}

export interface KeyManager<T> {
  get(key: string): Promise<Item<T>>;
  set(key: string, payload: any, update?: KeyUpdate): Promise<Item<T>>;
  del(key: string, indexOrName: number | string): Promise<Item<T>>;
}
