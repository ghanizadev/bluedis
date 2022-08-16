import React, { FC } from "react";
import styled from "styled-components";

import CloseIcon from "../../../assets/Close";
import { Connection } from "../../../redux/Types/Connection";

const Container = styled.li`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 40px;
  margin-bottom: 8px;
  padding: 3px;
  cursor: pointer;

  &:hover {
    color: ${(props) => props.theme.foreground};
  }
`;

const InnerText = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.8rem;

  & strong {
    font-size: 0.9rem;
  }
`;

const CloseButton = styled.button`
  background-image: url("/close.svg");
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  
  background-color: transparent;
  border: none;
  
  height: 16px;
  width: 16px;
  
  filter: invert(1);
  
  &:hover {
    filter: invert(0);
    background-color: ${(props) => props.theme.innerText};
  }
`;

type Props = {
  connection: Connection;
  onConnect: (connection: Connection) => void;
  onRemove: (connection: Connection) => void;
};

export const Favorite: FC<Props> = (props) => {
  const { connection, onConnect, onRemove } = props;

  const handleRemove = (connection: Connection) => {
    return (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      onRemove(connection);
    };
  };
  return (
    <Container onClick={() => onConnect(connection)}>
      <InnerText>
        <strong>{connection.name}</strong>
        <br />
        redis://{connection.host}:{connection.port}
      </InnerText>
      <CloseButton onClick={handleRemove(connection)} />
    </Container>
  );
};
