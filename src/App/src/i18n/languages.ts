import en from "./en.json"
import pt from "./pt.json"

export enum Language {
  'English' = 'en',
  'Português' = 'pt'
}

const languageMapping: {[key: string]: { [key: string]: any} } = {
  en,
  pt,
}

export default languageMapping