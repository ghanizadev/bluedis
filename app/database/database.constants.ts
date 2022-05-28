import { AnyItem, ItemType } from "./database.dto";

export const DEFAULT_ITEM: AnyItem = {
  key: "",
  value: "",
  type: ItemType.STRING,
  ttl: -1,
};
