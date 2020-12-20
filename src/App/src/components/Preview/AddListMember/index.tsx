import React from "react";
import Button from "../../Button";
import { ButtonWrapper } from "./ButtonWrapper";
import { Container } from "./Container";
import { Content } from "./Content";
import { TextArea } from "./TextArea";

import {ReactComponent as RemoveIcon} from "../../../assets/trash.svg";
import {ReactComponent as CopyIcon} from "../../../assets/clipboard.svg";
import styled from "styled-components";

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
  onSubmit: (value: string, index: number) => void;
  onDelete: (value: string, index: number) => void;
  onClose: () => void;
  value?: { value: string; index: number };
};

const AddListMember: React.FC<Props> = (props) => {
  const { onSubmit, onDelete, onClose, value } = props;

  const textAreaRef = React.useRef<HTMLTextAreaElement>(null);

  const handleClose = () => {
    onClose();
  };

  const handleSave = () => {
    if (textAreaRef.current?.value)
      onSubmit(textAreaRef.current.value, value?.index ?? -1);
  };
  const handleItemCopy = () => {
    if(value){
      const text = JSON.stringify({[value.index]: value.value})
      navigator.clipboard.writeText(text);
    }
  }
  const handleItemRemove = () => {
    if(value)
      onDelete(value.value, value.index);
  }

  return (
    <>
      <Container />
      <Content>
        <h3>Add/Edit Item</h3>
        <TextArea ref={textAreaRef}>{value?.value}</TextArea>
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
    </>
  );
};

export default AddListMember;
