import React from "react";
import styled from "styled-components";
import Button from "../../Button";
import { ButtonWrapper } from "./ButtonWrapper";
import { Container } from "./Container";
import { Content } from "./Content";
import { TextArea } from "./TextArea";

import {ReactComponent as RemoveIcon} from "../../../assets/trash.svg";
import {ReactComponent as CopyIcon} from "../../../assets/clipboard.svg";
import { SquareButton } from "../SquareButton";

const Actions = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin-top: 10px;
`;

const Input = styled.input`
  width: 100%;
  height: 30px;
`;

const Label = styled.label`
  margin-top: 15px;
`;

type Props = {
  onSubmit: (oldValue: string, newValue: string, score: string) => void;
  onClose: () => void;
  item: { score: string; value: string, isNew: boolean };
  onDelete: (item: { score: string; value: string }) => void;
};

const AddOrderedItem: React.FC<Props> = (props) => {
  const { onSubmit, onDelete, onClose, item } = props;
  const {score, value, isNew} = item;

  const valueRef = React.useRef<HTMLTextAreaElement>(null);
  const scoreRef = React.useRef<HTMLInputElement>(null);

  const handleClose = () => {
    onClose();
  };

  const handleSave = () => {
    if (valueRef.current?.value && scoreRef.current?.value)
      onSubmit(isNew ? "" : value, valueRef.current.value, scoreRef.current.value);
  }; 

  const handleItemCopy =() => {
    const text = JSON.stringify({[score]: value});
    navigator.clipboard.writeText(text);
  }

  const handleItemRemove = () => {
    onDelete(item);
  }

  return (
    <Container>
      <Content>
        <h3>{isNew ? "Add" : "Edit"} Item</h3>
        <Label>
          Score: <br />
          <Input ref={scoreRef} defaultValue={item?.score} />
        </Label>
        <Label style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          Value: <br />
          <TextArea ref={valueRef}>{item?.value}</TextArea>
        </Label>
        <Actions>
          <SquareButton onClick={handleItemCopy}>
            <CopyIcon title="Copy as JSON" />
          </SquareButton>
          <SquareButton remove onClick={handleItemRemove}>
            <RemoveIcon title="Remove property" />
          </SquareButton>
        </Actions>
        <ButtonWrapper>
          <Button label="Close" onClick={handleClose} />
          <Button label="Save" onClick={handleSave} />
        </ButtonWrapper>
      </Content>
    </Container>
  );
};

export default AddOrderedItem;
