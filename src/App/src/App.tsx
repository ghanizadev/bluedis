import React from "react";
import { useSelector } from "react-redux";
import { ThemeProvider } from "styled-components";
import Frame from "./components/Frame";
import Home from "./pages/Home";
import { DarkTheme, defaultSettings, ColorSchema, AppearenceSettings, LightTheme } from "./theme";
import { State } from "./redux/Types/State";
import { Page } from "./redux/Types/Page";
import Help from "./pages/Help";
import Settings from "./pages/Settings";
import Sidebar from "./components/Sidebar";
import { GlobalStyles } from "./theme/globalStyles";
import { store } from "./redux/store";
import { getPreferences } from "./services/mainProcess";
import ErrorMessage from "./components/ErrorMessage";
import ConfirmationMessage from "./components/ConfirmationMessage";

export const SettingsContext = React.createContext({
  setTheme: (theme: ColorSchema) => {
    return;
  },
  theme: {...DarkTheme, fontFamily: "", fontSize: "14pt"}
});

const App = () => {
  const [theme, setTheme] = React.useState<ColorSchema & AppearenceSettings>({...DarkTheme, ...defaultSettings});
  const currentPage = useSelector<State, Page>((state) => state.currentPage);


  const changeTheme = React.useCallback(
    (newTheme: ColorSchema) => {
      setTheme({...theme, ...newTheme});
    },
    [setTheme, theme]
  );

  const registerStore = React.useCallback(() => {
    store.subscribe(() => {
      const {settings: {appearence}} = store.getState();

      const t : ColorSchema & AppearenceSettings = {
        ...(appearence.darkTheme ? DarkTheme : LightTheme),
        fontFamily: appearence.fontFamily,
        fontSize: appearence.fontSize,
      };

      setTheme(t);
    })
  }, [])

  React.useEffect(() => {
    registerStore()
    getPreferences();
  }, [registerStore]);

  return (
    <SettingsContext.Provider
      value={{ theme, setTheme: changeTheme }}
    >
      <ThemeProvider theme={theme}>
        <Frame>
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "row",
            }}
          >
            <Sidebar />
            {currentPage === "home" && <Home />}
            {currentPage === "settings" && <Settings />}
            {currentPage === "help" && <Help />}
          </div>
        </Frame>
        <GlobalStyles />
        <ErrorMessage />
        <ConfirmationMessage />
      </ThemeProvider>
    </SettingsContext.Provider>
  );
};

export default App;
