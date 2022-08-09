import React from "react";
import { useSelector } from "react-redux";
import { ThemeProvider } from "styled-components";

import Frame from "./components/Frame";
import Database from "./pages/Database";
import { State } from "./redux/Types/State";
import { Page } from "./redux/Types/Page";
import Help from "./pages/Help";
import Settings from "./pages/Settings";
import Sidebar from "./components/Sidebar";
import { GlobalStyles } from "./theme/globalStyles";
import { getPreferences } from "./services/main-process";
import ErrorMessage from "./components/ErrorMessage";
import ConfirmationMessage from "./components/ConfirmationMessage";
import EditTTL from "./components/EditTTL";
import Loading from "./components/Loading";
import { Appearance } from "./redux/Types/Appearance";
import Connect from "./pages/connect";

const App = () => {
  const currentPage = useSelector<State, Page>((state) => state.currentPage);
  const isConnected = useSelector<State, boolean>((state) => state.connected);
  const appearance = useSelector<State, Appearance>(
    (state) => state.settings.appearance
  );

  React.useEffect(() => {
    getPreferences();
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
