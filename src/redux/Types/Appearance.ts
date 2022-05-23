export type AppearanceFont =
  | "Roboto"
  | "JetBrains Mono"
  | "Montserrat"
  | "Open Sans";

export type AppearanceSchema = "dark" | "light";

export interface Appearance {
  darkTheme?: boolean;
  systemTheme?: AppearanceSchema;
  fontFamily: AppearanceFont;
  fontSize: string;
}

export {};
