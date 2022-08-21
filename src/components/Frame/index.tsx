import React, { FC, useEffect } from "react";
import { useSelector } from "react-redux";

import { State } from "../../redux/Types/State";
import { Connection } from "../../redux/Types/Connection";

import { WorkingArea } from "./WorkingArea";
import { Background } from "./Background";
import { OSXBar } from "./osx-bar";
import { Win32Bar } from "./win32-bar";

const Frame: FC<{ children?: React.ReactNode | React.ReactNode[] }> = (
  props
) => {
  const connected = useSelector<State, boolean>((state) => state.connected);
  const connection = useSelector<State, Connection | undefined>(
    (state) => state.connection
  );
  const favorites = useSelector<State, Connection[]>(
    (state) => state.favorites
  );
  const [host, setHost] = React.useState("");
  const [name, setName] = React.useState("");
  const [platform, setPlatform] = React.useState<string>();

  const formatName = (name: string) => {
    if (name.length > 30) {
      return ` | [${name.slice(0, 12)}...${name.slice(-12)}]`;
    } else {
      return ` | [${name}]`;
    }
  };

  useEffect(() => {
    if (!connection || !connected) {
      setHost("");
      setName("");
      return;
    }

    if (connection.host.length > 30) {
      setHost(
        ` - redis${connection.tls ? "s" : ""}://${connection.host.slice(
          0,
          12
        )}...${connection.host.slice(-12)}:${connection.port}`
      );
    } else {
      setHost(
        ` - redis${connection.tls ? "s" : ""}://${connection.host}:${
          connection.port
        }`
      );
    }

    if (!connection.name) {
      const conn = favorites.find((fav) => {
        return (
          fav.host === connection.host &&
          fav.port === connection.port &&
          fav.password === connection.password &&
          fav.tls === connection.tls
        );
      });

      if (conn) setName(formatName(conn.name ?? ""));
    } else {
      setName(formatName(connection.name));
    }
  }, [connection, favorites, connected]);

  useEffect(() => {
    window.__TAURI__.os.platform().then((p: any) => setPlatform(p));
  }, []);

  if (!platform) return <div />;

  return (
    <Background data-testid="frame">
      {platform === "darwin" ? (
        <OSXBar title={`Bluedis ${host}${name}`} />
      ) : (
        <Win32Bar title={`Bluedis ${host}${name}`} />
      )}
      <WorkingArea>{props.children}</WorkingArea>
    </Background>
  );
};

export default Frame;
