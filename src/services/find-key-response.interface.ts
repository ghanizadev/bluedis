import { RawKey } from "./key.interface";

export interface FindKeyResponse {
  Error?: string;
  Response?: {
    Collection: { keys: RawKey[]; cursor: number };
    Single: { key: RawKey; cursor: number };
  };
}
