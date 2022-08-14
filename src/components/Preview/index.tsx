import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";

import CloseIcon from "../../assets/Close";
import { State } from "../../redux/Types/State";
import {
  HashType,
  Item,
  ListType,
  SetType,
  StringType,
  ZSetType,
} from "../../redux/Types/Item";
import { useLoading } from "../../shared/hooks/use-loading.hook";

import HashComponent from "./HashComponent";
import ListComponent from "./ListComponent";
import SetComponent from "./SetComponent";
import StringComponent from "./StringComponent";
import ZSetComponent from "./ZSetComponent";
import { Container } from "./Container";
import { Header } from "./Header";

const Close = styled.button`
  background-color: transparent;
  border: none;
  margin-left: 3px;
  color: ${(props) => props.theme.text};
  display: flex;
  justify-content: center;
  align-items: center;

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

  const preview = useSelector((state: State) => state.preview);
  const loading = useLoading();

  useEffect(() => {
    if (preview) loading(false);
  }, [preview]);

  const handleCloseRequest = () => {
    onCloseRequest && onCloseRequest();
  };

  return (
    <Container open={!!preview} data-testid="preview-container">
      {!!preview && (
        <>
          <Header>
            <h1>{preview.key}</h1>
            <Close data-testid="preview-close" onClick={handleCloseRequest}>
              <CloseIcon width={18} height={18} />
            </Close>
          </Header>
          <Content>
            {preview.type === "string" && (
              <StringComponent item={preview as Item<StringType>} />
            )}
            {preview.type === "list" && (
              <ListComponent item={preview as Item<ListType>} />
            )}
            {preview.type === "zset" && (
              <ZSetComponent item={preview as Item<ZSetType>} />
            )}
            {preview.type === "set" && (
              <SetComponent item={preview as Item<SetType>} />
            )}
            {preview.type === "hash" && (
              <HashComponent item={preview as Item<HashType>} />
            )}
          </Content>
        </>
      )}
    </Container>
  );
};

export default Preview;
