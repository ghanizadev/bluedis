import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { ThemeProvider } from "styled-components";

import Frame from "./components/Frame";
import Database from "./pages/Database";
import { State } from "./redux/Types/State";
import { Page } from "./redux/Types/Page";
import Help from "./pages/Help";
import Settings from "./pages/Settings";
import Sidebar from "./components/Sidebar";
import { GlobalStyles } from "./theme/globalStyles";
import ErrorMessage from "./components/ErrorMessage";
import ConfirmationMessage from "./components/ConfirmationMessage";
import EditTTL from "./components/EditTTL";
import Loading from "./components/Loading";
import { Appearance } from "./redux/Types/Appearance";
import Connect from "./pages/connect";
import { defaultAppearanceSettings, DarkTheme, LightTheme } from "./theme";
import { actions, store } from "./redux/store";
import { invoke } from "@tauri-apps/api";
import { Language } from "./i18n";
import { Connection } from "./redux/Types/Connection";

const App = () => {
  const currentPage = useSelector<State, Page>((state) => state.currentPage);
  const isConnected = useSelector<State, boolean>((state) => state.connected);
  const appearance = useSelector<State, Appearance>(
    (state) => state.settings.appearance
  );
  const dispatch = useDispatch();

  const updateSettings = async () => {
    let settings = await invoke<{ Error?: string; Success?: any }>(
      "load_preference"
    );

    if(settings.Error) {
      dispatch(actions.setError({
        title: "Error",
        message: settings.Error,
      }));

      return;
    }

    dispatch(
      actions.updatePreferences({
        appearance: {
          ...defaultAppearanceSettings,
          fontSize: settings.Success.font_size,
          fontFamily: settings.Success.font_name,
          darkTheme: settings.Success.dark_mode,
          ...(settings.Success.dark_mode ? DarkTheme : LightTheme),
        },
        region: {
          language: settings.Success.language as Language,
        },
      })
    );

    let favorites = await invoke<{ Error?: string, Collection: any[] }>("get_all_favorites");

    if(favorites.Error) {
      dispatch(actions.setError({
        title: "Error",
        message: favorites.Error,
      }));

      return;
    }

    dispatch(
      actions.updateFavorites(
        favorites.Collection.map<Connection>((f) => ({
          tls: f.tls,
          port: f.port.toString(),
          password: f.password,
          name: f.name,
          host: f.host,
          id: f.id,
        }))
      )
    );
  };

  React.useEffect(() => {
    updateSettings();
  }, []);

  return (
    <ThemeProvider theme={appearance}>
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
          <>
            {["database"].includes(currentPage) && !isConnected && <Connect />}
            {isConnected && currentPage === "database" && <Database />}
            {/* TODO add message debugger */}
          </>
          {currentPage === "settings" && <Settings />}
          {currentPage === "help" && <Help />}
        </div>
      </Frame>
      <GlobalStyles />
      <EditTTL />
      <ErrorMessage />
      <ConfirmationMessage />
      <Loading />
    </ThemeProvider>
  );
};

export default App;
