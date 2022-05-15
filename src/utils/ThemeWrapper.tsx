import React, {FC} from "react";
import { Provider } from "react-redux";
import { ThemeProvider } from "styled-components";
import { store } from "../redux/store";
import { defaultSettings, LightTheme } from "../theme";

export const ThemeWrapper: FC<any> = ({ children }) => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={{ ...LightTheme, ...defaultSettings }}>
        {children}
      </ThemeProvider>
    </Provider>
  );
};
