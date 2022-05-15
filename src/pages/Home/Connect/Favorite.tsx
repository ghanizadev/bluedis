import React from "react";
import styled from "styled-components";

import { ReactComponent as CloseIcon } from "../../../assets/close.svg";
import { Connection } from "../../../redux/Types/Connection";

const Container = styled.li`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 200px;
  height: 40px;
  margin-bottom: 8px;
  padding: 3px;
  cursor: pointer;

  &:hover {
    background-color: ${(props) => props.theme.foreground};
    color: ${(props) => props.theme.innertext};
  }

  & svg {
    width: 16px;
    height: 16px;
    min-width: 16px;
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

type Props = {
  connection: Connection;
  onConnect: (connection: Connection) => void;
  onRemove: (connection: Connection) => void;
};
const Favorite: React.FC<Props> = (props) => {
  const { connection, onConnect, onRemove } = props;

  const handleRemove = (connection: Connection) => {
    return (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
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
      <CloseIcon onClick={handleRemove(connection)} />
    </Container>
  );
};

export default Favorite;
