/* eslint-disable  @typescript-eslint/no-explicit-any */

import { store } from "../redux/store";

import pt_BR from "./pt_BR";
import { LangType } from "./i18n.dto";

const mapLanguage = (
  lang: LangType,
  defaultResponse: string,
  items: string[],
  args: any[]
) => {
  const keyLike = items
    .map((k) => k.toLowerCase().trim())
    .join("")
    .replace(/[ .,/#!$?%^&*;:{}=\-_`~()]/g, "");
  const keys = Object.entries(pt_BR);
  let response = defaultResponse;

  for (let i = 0; i < keys.length; i++) {
    const [k, v] = keys[i];

    if (k === keyLike) {
      response = typeof v === "string" ? v : v(...args);
      break;
    }
  }

  return response;
};

export const t = (value: TemplateStringsArray, ...args: any[]) => {
  const language = store.getState().settings.region.language;
  const items = value.slice(0, args.length + 1);

  const response = items
    .reduce(
      (p, c, index) =>
        index < args.length ? [...p, c, args[index].toString()] : [...p, c],
      [] as string[]
    )
    .join("");

  switch (language) {
    case Language.pt_BR:
      return mapLanguage(pt_BR, response, items, args);
    default:
      return response;
  }
};

export enum Language {
  en_US,
  pt_BR,
}
