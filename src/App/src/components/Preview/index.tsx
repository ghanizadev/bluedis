import React from "react";
import HashComponent from "./HashComponent";
import ListComponent from "./ListComponent";
import SetComponent from "./SetComponent";
import StringComponent from "./StringComponent";
import ZSetComponent from "./ZSetComponent";
import { Container } from "./Container";
import { Header } from "./Header";
import { useSelector } from "react-redux";
import styled from "styled-components";

import { ReactComponent as CloseIcon } from "../../assets/close.svg";

const Close = styled.button`
  background-color: transparent;
  border: none;
  margin-left: 3px;
  color: ${(props) => props.theme.text};

  &:hover {
    color: tomato;
  }
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

type Props = {
  onCloseRequest?: () => void;
};

const Preview: React.FC<Props> = (props) => {
  const { onCloseRequest } = props;
  const preview = useSelector((state: any) => state.preview);

  const handleCloseRequest = () => {
    onCloseRequest && onCloseRequest();
  };

  return (
    <Container open={!!preview}>
      {!!preview && (
        <>
          <Header>
            <h1>{preview.key}</h1>
            <Close onClick={handleCloseRequest}>
              <CloseIcon width={18} height={18} />
            </Close>
          </Header>
          <Content>
            {preview.type === "string" && <StringComponent item={preview} />}
            {preview.type === "list" && <ListComponent item={preview} />}
            {preview.type === "zset" && <ZSetComponent item={preview} />}
            {preview.type === "set" && <SetComponent item={preview} />}
            {preview.type === "hash" && <HashComponent item={preview} />}
          </Content>
        </>
      )}
    </Container>
  );
};

export default Preview;
