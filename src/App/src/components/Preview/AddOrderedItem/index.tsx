import React from "react";
import styled from "styled-components";
import Button from "../../Button";
import { MessageBackground } from "../../common/MessageBackground";
import { MessageContent } from "../../common/MessageContent";
import { MessageButtonWrapper } from "../../common/MessageButtonWrapper";
import { TextArea } from "../../TextArea";
import { PreviewActions } from "../../common/PreviewActions";
import { PreviewActionButton } from "../../common/PreviewActionButton";

import {ReactComponent as RemoveIcon} from "../../../assets/trash.svg";
import {ReactComponent as CopyIcon} from "../../../assets/clipboard.svg";

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
    <>
    <MessageBackground />
      <MessageContent>
        <h3>{isNew ? "Add" : "Edit"} Item</h3>
        <Label>
          Score: <br />
          <Input ref={scoreRef} defaultValue={item?.score} />
        </Label>
        <Label style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          Value: <br />
          <TextArea ref={valueRef}>{item?.value}</TextArea>
        </Label>
        <PreviewActions>
          <PreviewActionButton onClick={handleItemCopy}>
            <CopyIcon title="Copy as JSON" />
          </PreviewActionButton>
          <PreviewActionButton remove onClick={handleItemRemove}>
            <RemoveIcon title="Remove property" />
          </PreviewActionButton>
        </PreviewActions>
        <MessageButtonWrapper>
          <Button label="Close" onClick={handleClose} />
          <Button label="Save" onClick={handleSave} />
        </MessageButtonWrapper>
      </MessageContent>
    </>
  );
};

export default AddOrderedItem;
