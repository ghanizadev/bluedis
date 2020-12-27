import React from "react";
import styled from "styled-components";
import Button from "../Button";
import { MessageBackground } from "../common/MessageBackground";
import { MessageContent } from "../common/MessageContent";
import Dropdown from "../Dropdown";
import Input from "../Input";

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
  onConfirm: (
    type: "set" | "zset" | "hash" | "string" | "list",
    key: string
  ) => void;
};

const AddKey: React.FC<Props> = (props) => {
  const { onCancel, onConfirm } = props;
  const [type, setType] = React.useState("set");
  const [key, setKey] = React.useState("");

  const handleConfirm = () => {
    if (!type || !key) return;
    onConfirm(type as any, key);
  };

  const handleCancel = () => {
    onCancel();
  };

  const handleTypeChange = (type: string) => {
    setType(type);
  };

  const handleKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKey(e.target.value);
  };

  return (
    <>
      <MessageBackground />
      <MessageContent data-testid="data-add-message" >
        <h3>Add new key</h3>
        <Row>
          <Key onChange={handleKeyChange} />
          <Dropdown
            onChange={handleTypeChange}
            items={["set", "zset", "hash", "string", "list"]}
          />
        </Row>
        <Row style={{ justifyContent: "flex-end" }}>
          <Button label="Cancel" onClick={handleCancel} />
          <Button label="Confirm" onClick={handleConfirm} />
          <button data-testid="teste1" onClick={handleConfirm} >Teste1</button>
        </Row>
      </MessageContent>
    </>
  );
};

export default AddKey;
