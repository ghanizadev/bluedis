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
  margin: 8px 0;
  padding: 3px;
  cursor: pointer;

  &:hover {
    background-color: ${(props) => props.theme.foreground};
    color: ${(props) => props.theme.innertext};
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
      <div>
        <strong>{connection.name}</strong>
        <br />
        <small>
          redis://{connection.host}:{connection.port}
        </small>
      </div>
      <CloseIcon width={16} height={16} onClick={handleRemove(connection)} />
    </Container>
  );
};

export default Favorite;
