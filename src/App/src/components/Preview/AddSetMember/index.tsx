import React from "react";
import styled from "styled-components";
import Button from "../../Button";
import { SquareButton } from "../SquareButton";
import { ButtonWrapper } from "./ButtonWrapper";
import { Container } from "./Container";
import { Content } from "./Content";
import { TextArea } from "./TextArea";

import {ReactComponent as RemoveIcon} from "../../../assets/trash.svg";
import {ReactComponent as CopyIcon} from "../../../assets/clipboard.svg";

const Actions = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin-top: 10px;
`;

type Props = {
  onSubmit: (oldValue: string, newValue: string) => void;
  onDelete: (value: string) => void;
  onClose: () => void;
  value: {isNew: boolean, value: string};
};

const AddSetMember: React.FC<Props> = (props) => {
  const { onSubmit, onDelete, onClose, value } = props;

  const textAreaRef = React.useRef<HTMLTextAreaElement>(null);

  const handleClose = () => {
    onClose();
  };

  const handleSave = () => {
    if (textAreaRef.current?.value) onSubmit(value.isNew ? "" : value.value, textAreaRef.current.value);
  };

  const handleItemRemove = () => {
    onDelete(value.value);
  };

  const handleItemCopy = () => {
    if (textAreaRef.current?.value){
      const text = JSON.stringify([textAreaRef.current.value]);
      navigator.clipboard.writeText(text);
    }
  };

  return (
    <Container>
      <Content>
        <h3>{value.isNew ? "Add" : "Edit"} Item</h3>
        <TextArea ref={textAreaRef}>{value.value}</TextArea>
        {!value.isNew && <Actions>
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
    </Container>
  );
};

export default AddSetMember;
