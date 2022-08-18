import React, { useEffect } from "react";
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
import { invoke } from "@tauri-apps/api";
import { ConnectionResponse } from "../../services/connection-response.interface";
import { parseConnectionString } from "../../shared/helpers/parse-connection-string.helper";
import services from "../../services";

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

    let connectionString = parseConnectionString(conn);

    let connect = await invoke<ConnectionResponse>("authenticate", {
      cstr: connectionString,
    });

    if (connect.Error || !connect.Success) {
      dispatch(actions.setLoading(false));
      dispatch(
        actions.setError({
          title: "Error",
          message: !connect.Success
            ? "Failed to login, check your credentials and internet connection"
            : connect.Error ?? "Internal error",
        })
      );

      console.error(connect.Error);
      return;
    }

    dispatch(actions.currentConnection({ ...conn, id: nanoid(8) }));
    await services.findKeys();
  };

  const updateFavorites = async (favorites: Connection[]) => {
    await Promise.all(
      favorites.map(async (fav) => {
        let resp = await invoke<any>("save_favorite", {
          fav: { ...fav, port: +fav.port },
        });

        if (resp.Error)
          dispatch(
            actions.setError({
              title: "Error",
              message: resp.Error,
            })
          );
      })
    );
  };

  const handleRemoveFromHistory = async (connection: Connection) => {
    dispatch(actions.removeFavorite(connection.id));
    const resp = await invoke<{ Error?: string }>("del_favorite", {
      id: connection.id,
    });

    if (resp.Error)
      dispatch(
        actions.setError({
          title: "Error",
          message: resp.Error,
        })
      );
  };

  const handleConnectFromHistory = async (conn: Connection) => {
    return connect(conn);
  };

  const handleConnect = async () => {
    return connect(connection);
  };

  const handleHostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const url = new URL(e.target.value);

      setConnection({
        ...connection,
        host: url.hostname,
        port: url.port,
        password: url.password,
        tls: url.protocol.startsWith("rediss"),
      });
    } catch (err) {
      setConnection({ ...connection, host: e.target.value });
    }
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

  useEffect(() => {
    updateFavorites(favorites);
  }, [favorites]);

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
                value={connection.host}
                onChange={handleHostChange}
                spellCheck={false}
                autoCapitalize={"off"}
              />
            </label>
            <label>
              {t`Port`}:
              <br />
              <input
                value={connection.port}
                onChange={handlePortChange}
                spellCheck={false}
                autoCapitalize={"off"}
              />
            </label>
            <label>
              {t`Password`}:
              <br />
              <input
                type="password"
                value={connection.password}
                onChange={handlePasswordChange}
              />
            </label>
            <label>
              <input
                type="checkbox"
                checked={connection.tls}
                onChange={handleTLSChange}
              />{" "}
              {t`Use TLS`}
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
