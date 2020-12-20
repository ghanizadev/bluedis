import React from "react";
import styled from "styled-components";
import Button from "../Button";
import Dropbox from "../Dropbox";
import Input from "../Input";

const Container = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;

  display: flex;
  align-items: center;
  justify-content: center;
`;

const Content = styled.div`
  width: 500px;
  background-color: ${(props) => props.theme.sidebarBackground};
  border: 1px solid ${(props) => props.theme.text};
  position: relative;
  padding: 15px 8px;

  display: flex;
  flex-direction: column;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;

  margin-top: 15px;
`;

const Key = styled(Input)`
  flex: 1;
`;

type Props = {
  onCancel: () => void;
  onConfirm: (type: "set" | "zset" | "hash" | "string" | "list", key: string) => void;
};

const AddKey: React.FC<Props> = (props) => {
  const { onCancel, onConfirm } = props;
  const [type, setType] = React.useState("set");
  const [key, setKey] = React.useState('');

  const handleConfirm = () => {
    if(!type || !key) return;
    onConfirm(type as any, key);
  }

  const handleCancel = () => {
    onCancel();
  }

  const handleTypeChange = (type: string) => {
    setType(type);
  }

  const handleKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKey(e.target.value);
  }

  return (
    <Container>
      <Content>
        <h3>Add new key</h3>
        <Row>
          <Key onChange={handleKeyChange} />
          <Dropbox onChange={handleTypeChange} items={["set", "zset", "hash", "string", "list"]} />
        </Row>
        <Row style={{justifyContent: "flex-end"}}>
          <Button label="Cancel" onClick={handleCancel} />
          <Button label="Confirm"  onClick={handleConfirm} />
        </Row>
      </Content>
    </Container>
  );
};

export default AddKey;
