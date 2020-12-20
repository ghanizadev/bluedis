import React from "react";
import styled from "styled-components";
import Checkbox from "../../../components/Checkbox";

import { ReactComponent as CloseIcon } from "../../../assets/close.svg";
import { connect } from "../../../services/mainProcess";

const Container = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Content = styled.div`
  width: 60%;
  height: 400px;
  display: flex;
  align-items: center;
`;

const Recent = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  border-left: 1px solid gray;
  margin: 0 15px;
  padding: 0 15px;
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
`;

const ConnectionsList = styled.ul`
  list-style: none;
`;

const Connection = styled.li`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 150px;
  height: 30px;
  cursor: pointer;

  &:hover {
    background-color: ${(props) => props.theme.foreground};
  }
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

  const handleRemoveFromHistory = (
    e: React.MouseEvent<SVGSVGElement, MouseEvent>
  ) => {
    e.stopPropagation();
    alert("remove");
  };

  const handleConnectFromHistory = () => {
    alert("item");
  };

  const handleConnect = () => {
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
  const handleTLSChange = (value: boolean) => {
    setConnection({ ...connection, tls: !value });
  };

  return (
    <Container>
      <Content>
        <Form>
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
          <Checkbox
            checked={connection.tls}
            label="use TLS"
            onChangeValue={handleTLSChange}
          />
          <LoginButton onClick={handleConnect}>Connect</LoginButton>
        </Form>
        <Recent>
          <p>History</p>
          <ConnectionsList>
            <Connection onClick={handleConnectFromHistory}>
              <strong>locahost:6379</strong>
              <CloseIcon
                width={16}
                height={16}
                onClick={handleRemoveFromHistory}
              />
            </Connection>
          </ConnectionsList>
        </Recent>
      </Content>
    </Container>
  );
};

export default Connect;
