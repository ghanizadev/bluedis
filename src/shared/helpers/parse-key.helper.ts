import { RawKey } from "../../services/key.interface";
import { ItemType } from "../../redux/Types/Item";

export const parseKey = (k: RawKey): ItemType => {
  let value: any;

  if (k.key_type !== "string") {
    value = JSON.parse(k.value);
  } else {
    value = k.value;
  }

  return {
    value,
    key: k.key,
    ttl: k.ttl,
    type: k.key_type,
  };
};
