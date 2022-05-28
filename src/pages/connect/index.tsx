import React from "react";
import { nanoid } from "nanoid";
import { useDispatch, useSelector } from "react-redux";

import { connect, saveFavorites } from "../../services/mainProcess";
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

const Connect = () => {
  const [connection, setConnection] = React.useState({
    host: "localhost",
    port: "6379",
    password: "",
    tls: false,
  });
  const favorites = useSelector<State, Connection[]>(
    (state) => state.favorites
  );
  const dispatch = useDispatch();

  const handleRemoveFromHistory = (connection: Connection) => {
    dispatch(actions.removeFavorite(connection.id));
    const updated = store.getState();
    saveFavorites(updated.favorites);
  };

  const handleConnectFromHistory = (connection: Connection) => {
    dispatch(actions.currentConnection(connection));
    connect(connection);
  };

  const handleConnect = () => {
    dispatch(actions.currentConnection({ ...connection, id: nanoid(8) }));
    dispatch(actions.setLoading(true));
    connect(connection);
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
