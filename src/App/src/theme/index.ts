export interface ColorSchema {
  background: string;
  foreground: string;
  text: string;
  innertext: string;
  title: string;
  sidebarBackground: string;
}

export interface AppearenceSettings {
  fontFamily: string;
  fontSize: string;
}

export const DarkTheme : ColorSchema = {
  background: "#1f2f30",
  foreground: "#2ad4c3",
  text: "#fff",
  innertext: "#fff",
  title: "#fff",
  sidebarBackground: "#355052"
}

export const LightTheme : ColorSchema = {
  background: "#fdfdfd",
  foreground: "#2ad4c3",
  text: "#1f2f30",
  innertext: "#fff",
  title: "#1f2f30",
  sidebarBackground: "whitesmoke"
}

export const defaultSettings : AppearenceSettings = {
  fontFamily: "JetBrains Mono",
  fontSize: "10pt"
}