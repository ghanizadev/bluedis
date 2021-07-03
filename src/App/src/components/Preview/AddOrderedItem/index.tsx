import React from "react";
import styled from "styled-components";
import Button from "../../Button";
import { MessageBackground } from "../../common/MessageBackground";
import { MessageContent } from "../../common/MessageContent";
import { MessageButtonWrapper } from "../../common/MessageButtonWrapper";
import { TextArea } from "../../TextArea";
import { PreviewActions } from "../../common/PreviewActions";
import { PreviewActionButton } from "../../common/PreviewActionButton";

import { ReactComponent as RemoveIcon } from "../../../assets/trash.svg";
import { ReactComponent as CopyIcon } from "../../../assets/clipboard.svg";
import {useSelector} from "react-redux";
import {State} from "../../../redux/Types/State";

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
  item: { score: string; value: string; isNew: boolean };
  onDelete: (item: { score: string; value: string }) => void;
};

const AddOrderedItem: React.FC<Props> = (props) => {
  const { onSubmit, onDelete, onClose, item } = props;
  const { score, value, isNew } = item;
  const translation = useSelector<State, {[key: string]: string}>(state => state.settings.translation);

  const valueRef = React.useRef<HTMLTextAreaElement>(null);
  const scoreRef = React.useRef<HTMLInputElement>(null);

  const handleClose = () => {
    onClose();
  };

  const handleSave = () => {
    if (valueRef.current?.value && scoreRef.current?.value)
      onSubmit(
        isNew ? "" : value,
        valueRef.current.value,
        scoreRef.current.value
      );
  };

  const handleItemCopy = () => {
    if (!scoreRef.current || !valueRef.current) return;

    const currentScore = scoreRef.current.value;
    const currentValue = valueRef.current.value;

    const text = JSON.stringify({ [currentScore]: currentValue });
    navigator.clipboard.writeText(text);
  };

  const handleItemRemove = () => {
    onDelete(item);
  };

  return (
    <>
      <MessageBackground />
      <MessageContent>
        <h3>{isNew ? translation.additem : translation.edititem}</h3>
        <Label>
          {translation.score}: <br />
          <Input ref={scoreRef} defaultValue={score} />
        </Label>
        <Label style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {translation.value}: <br />
          <TextArea ref={valueRef} defaultValue={value} />
        </Label>
        <PreviewActions>
          <PreviewActionButton
            data-testid="message-copy"
            onClick={handleItemCopy}
          >
            <CopyIcon title={translation.copydoc} />
          </PreviewActionButton>
          <PreviewActionButton
            data-testid="message-remove"
            remove
            onClick={handleItemRemove}
          >
            <RemoveIcon title={translation.removeprop} />
          </PreviewActionButton>
        </PreviewActions>
        <MessageButtonWrapper>
          <Button label={translation.close} onClick={handleClose} />
          <Button label={translation.save} onClick={handleSave} />
        </MessageButtonWrapper>
      </MessageContent>
    </>
  );
};

export default AddOrderedItem;
