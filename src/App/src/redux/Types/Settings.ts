import { Appearance } from "./Appearance";
import { General } from "./General";
import { Region } from "./Region";

export interface Settings {
  appearance: Appearance;
  general: General;
  region: Region;
  license: string;
}

export {};