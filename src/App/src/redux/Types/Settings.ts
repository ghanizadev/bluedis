import { Appearence } from "./Appearence";
import { General } from "./General";
import { Region } from "./Region";

export interface Settings {
  appearence: Appearence;
  general: General;
  region: Region;
  license: string;
}

export {};