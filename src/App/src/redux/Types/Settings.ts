import { Appearence } from "./Appearence";
import { General } from "./General";
import { Region } from "./Region";
import {Language} from "../../i18n/languages";

export interface Settings {
  appearance: Appearence;
  general: General;
  region: Region;
  license: string;
  translation: {[key: string]: any};
  language: Language;
}

export {};