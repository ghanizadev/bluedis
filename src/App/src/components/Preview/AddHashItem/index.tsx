import React from "react";
import Button from "../../Button";
import { ButtonWrapper } from "./ButtonWrapper";
import { Container } from "./Container";
import { Content } from "./Content";
import { TextArea } from "./TextArea";
import { Label } from "./Label";
import { Input } from "./Input";
import styled from "styled-components";

import {ReactComponent as RemoveIcon} from "../../../assets/trash.svg";
import {ReactComponent as CopyIcon} from "../../../assets/clipboard.svg";

const Actions = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin-top: 10px;
`;

const SquareButton = styled.button<{remove?: boolean}>`
  color: ${props => props.theme.text};

  background-color: transparent;
  border: none;
  padding: 0;

  margin: 0 3px;

  &:hover{
    color: ${props => props.remove ? "tomato" : props.theme.foreground}
  }
`;

type Props = {
  onSubmit: (value: { key: string; value: string }) => void;
  onDelete: (value: { key: string; value: string }) => void;
  onClose: () => void;
  item: { key: string; value: string };
  newItem?: boolean;
};

const AddHashItem: React.FC<Props> = (props) => {
  const { onSubmit, onDelete, onClose, item, newItem } = props;

  const textAreaRef = React.useRef<HTMLTextAreaElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleClose = () => {
    onClose();
  };

  const handleItemRemove = () => {
    onDelete(item)
  };

  const handleItemCopy = () => {
    if (textAreaRef.current?.value && inputRef.current?.value){
      const text = JSON.stringify({[inputRef.current.value]: textAreaRef.current.value});
      navigator.clipboard.writeText(text);
    }
  };

  const handleSave = () => {
    if (textAreaRef.current?.value && inputRef.current?.value)
      onSubmit({
        key: inputRef.current.value,
        value: textAreaRef.current.value,
      });
  };

  return (
    <>
      <Container />
      <Content>
          <h4>{newItem? "Add" : "Edit"} Item</h4>
        <Label>
          Key: <br />
          <Input
            ref={inputRef}
            disabled={!!item.key}
            defaultValue={item?.key || "New Key"}
          />
        </Label>
        <Label style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          Value: <br />
          <TextArea ref={textAreaRef}>
            {item?.value || "New item here..."}
          </TextArea>
        </Label>
        {!newItem && <Actions>
          <SquareButton onClick={handleItemCopy}>
            <CopyIcon title="Copy as JSON" />
          </SquareButton>
          <SquareButton remove onClick={handleItemRemove}>
            <RemoveIcon title="Remove property" />
          </SquareButton>
        </Actions>}
        <ButtonWrapper>
          <Button label="Close" onClick={handleClose} />
          <Button label="Save" onClick={handleSave} />
        </ButtonWrapper>
      </Content>
    </>
  );
};

export default AddHashItem;
