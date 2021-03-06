import React from "react";
import styled from "styled-components";
import { nanoid } from "nanoid";
import { connect, saveFavorites } from "../../../services/mainProcess";
import { useDispatch, useSelector } from "react-redux";
import { actions, store } from "../../../redux/store";
import { State } from "../../../redux/Types/State";
import { Connection } from "../../../redux/Types/Connection";
import Favorite from "./Favorite";

const Container = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Content = styled.div`
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Recent = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  border-left: 1px solid gray;
  margin: 0 15px;
  padding: 0 15px;
  width: 230px;
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
`;

const ConnectionsList = styled.ul`
  list-style: none;
`;

const ListWrapper = styled.div`
  flex: 1;
  flex-basis: 0;
  overflow: hidden auto;
`;

const LoginButton = styled.button`
  width: 100%;
  margin: 8px 0;
  border: none;
  height: 30px;
  padding: 5px 8px;

  background-color: ${(props) => props.theme.foreground};
  color: ${(props) => props.theme.innertext};

  &:hover {
    filter: brightness(0.95);
  }
`;

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

  return (
  <>
    <Container>
      <Content>
        <Form data-testid="connect-form">
          <h1>Connect</h1>
          <label>
            Host:
            <br />
            <input defaultValue={connection.host} onChange={handleHostChange} />
          </label>
          <label>
            Port:
            <br />
            <input defaultValue={connection.port} onChange={handlePortChange} />
          </label>
          <label>
            Password:
            <br />
            <input type="password" onChange={handlePasswordChange} />
          </label>
          <LoginButton onClick={handleConnect}>Connect</LoginButton>
        </Form>
        <Recent>
          <p>Favorites</p>
          <br />
          <ListWrapper>
            <ConnectionsList>
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
                  <p style={{ color: "gray" }}>No favorites so far...</p>
                </>
              )}
            </ConnectionsList>
          </ListWrapper>
        </Recent>
      </Content>
    </Container>
    </>
  );
};

export default Connect;
