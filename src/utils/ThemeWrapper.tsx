import React, {FC} from "react";
import { Provider } from "react-redux";
import { ThemeProvider } from "styled-components";
import { store } from "../redux/store";
import { defaultAppearanceSettings, LightTheme } from "../theme";

export const ThemeWrapper: FC<any> = ({ children }) => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={{ ...LightTheme, ...defaultAppearanceSettings }}>
        {children}
      </ThemeProvider>
    </Provider>
  );
};
