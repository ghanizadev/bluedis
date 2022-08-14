import React from "react";
import { nanoid } from "nanoid";
import { useDispatch, useSelector } from "react-redux";

import { actions, store } from "../../redux/store";
import { State } from "../../redux/Types/State";
import { Connection } from "../../redux/Types/Connection";
import SocialMedia from "../../components/SocialMedia";
import { t } from "../../i18n";

import { Favorite } from "./components/favorite";
import { Container } from "./components/container";
import { Content } from "./components/content";
import { Form } from "./components/form";
import { LoginButton } from "./components/login-button";
import { Recent } from "./components/recent";
import { ListWrapper } from "./components/list-wrapper";
import { ConnectionList } from "./components/connection-list";
import {invoke} from "@tauri-apps/api";
import {FindKeysResponse} from "../../services/find-keys-response.interface";
import {ConnectionResponse} from "../../services/connection-response.interface";

const Connect = () => {
  const [connection, setConnection] = React.useState<Connection>({
    host: "localhost",
    port: "6379",
    password: "",
    tls: false,
    id: "new-connection",
  });
  const favorites = useSelector<State, Connection[]>(
    (state) => state.favorites
  );
  const dispatch = useDispatch();

  const connect = async (conn: Connection) => {
    dispatch(actions.setLoading(true));

    let connectionString = `redis${conn.tls ? 's': ''}://${conn.password ? `:${conn.password}@`:''}${conn.host}:${conn.port}`;

    let connect = await invoke<ConnectionResponse>('authenticate', { cstr: connectionString });

    if(connect.Error || !connect.Success) {
      dispatch(actions.setLoading(false));
      dispatch(actions.setError({
        title: "Error",
        message: !connect.Success ? "Failed to login, check you credentials and internet connection" : (connect.Error ?? "Internal error")
      }))

      return;
    }

    const data  = await invoke<FindKeysResponse>("find_keys", { cstr: connectionString, pattern: "*" })

    if(data.Error) {
      dispatch(actions.setLoading(false));
      dispatch(actions.setError({
        title: "Error",
        message: data.Error
      }))

      return;
    }

    dispatch(actions.setData(data.Response!.Collection.map(item => ({
      value: item.value,
      type: item.key_type,
      key: item.key,
      ttl: item.ttl,
    }))));

    dispatch(actions.setConnected(true));
    dispatch(actions.currentConnection({ ...conn, id: nanoid(8) }));
    dispatch(actions.setLoading(false));
  }

  const handleRemoveFromHistory = (connection: Connection) => {
    dispatch(actions.removeFavorite(connection.id));
    const updated = store.getState();
    // saveFavorites(updated.favorites);
  };

  const handleConnectFromHistory = async (conn: Connection) => {
    return connect(conn);
  };

  const handleConnect = async () => {
    return connect(connection);
  };

  const handleHostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConnection({ ...connection, host: e.target.value });
  };
  const handlePortChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConnection({ ...connection, port: e.target.value });
  };
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConnection({ ...connection, password: e.target.value });
  };
  const handleTLSChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConnection({ ...connection, tls: e.target.checked });
  };

  return (
    <>
      <Container>
        <Content>
          <Form data-testid="connect-form">
            <h1>{t`Connect`}</h1>
            <label>
              {t`Host`}:
              <br />
              <input
                defaultValue={connection.host}
                onChange={handleHostChange}
              />
            </label>
            <label>
              {t`Port`}:
              <br />
              <input
                defaultValue={connection.port}
                onChange={handlePortChange}
              />
            </label>
            <label>
              {t`Password`}:
              <br />
              <input type="password" onChange={handlePasswordChange} />
            </label>
            <label>
              <input type="checkbox" onChange={handleTLSChange} /> {t`Use TLS`}
            </label>
            <LoginButton onClick={handleConnect}>{t`Connect`}</LoginButton>
          </Form>
          <Recent>
            <p>{t`Favorites`}</p>
            <br />
            <ListWrapper>
              <ConnectionList>
                {favorites.map((connection) => {
                  return (
                    <Favorite
                      key={connection.id}
                      connection={connection}
                      onRemove={handleRemoveFromHistory}
                      onConnect={handleConnectFromHistory}
                    />
                  );
                })}
                {favorites.length === 0 && (
                  <>
                    <p style={{ color: "gray" }}>{t`No favorites so far...`}</p>
                  </>
                )}
              </ConnectionList>
            </ListWrapper>
          </Recent>
        </Content>
        <SocialMedia />
      </Container>
    </>
  );
};

export default Connect;
