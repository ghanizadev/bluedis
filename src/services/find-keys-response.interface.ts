import {RawKey} from "./key.interface";

export interface FindKeysResponse {
    Error?: string;
    Response?: {
        Collection: RawKey[];
    }
}