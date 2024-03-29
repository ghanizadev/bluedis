export interface ColorSchema {
  background: string;
  foreground: string;
  text: string;
  innerText: string;
  title: string;
  accent: string;
  sidebarBackground: string;
}

export interface AppearenceSettings {
  fontFamily: string;
  fontSize: number;
}

export const DarkTheme: ColorSchema = {
  background: "#1f2f30",
  foreground: "#2ad4c3",
  text: "#fff",
  innerText: "#fff",
  accent: "#0b9d8e",
  title: "#fff",
  sidebarBackground: "#355052",
};

export const LightTheme: ColorSchema = {
  background: "#fdfdfd",
  foreground: "#2ad4c3",
  text: "#1f2f30",
  innerText: "#fff",
  accent: "#2ad4c3",
  title: "#1f2f30",
  sidebarBackground: "#edf5f4",
};

export const defaultAppearanceSettings: AppearenceSettings = {
  fontFamily: "JetBrains Mono",
  fontSize: 10,
};
