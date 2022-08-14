import React from "react";
import styled from "styled-components";

import Button from "../../Button";
import { MessageBackground } from "../../common/MessageBackground";
import { MessageContent } from "../../common/MessageContent";
import { MessageButtonWrapper } from "../../common/MessageButtonWrapper";
import { TextArea } from "../../TextArea";
import { PreviewActions } from "../../common/PreviewActions";
import { PreviewActionButton } from "../../common/PreviewActionButton";
import RemoveIcon from "../../../assets/Trash";
import CopyIcon from "../../../assets/Clipboard";
import { t } from "../../../i18n";

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
  item: { score: string; value: string; isNew?: boolean };
  onDelete: (item: { score: string; value: string }) => void;
};

const AddOrderedItem: React.FC<Props> = (props) => {
  const { onSubmit, onDelete, onClose, item } = props;
  const { score, value, isNew } = item;

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
      <MessageContent data-testid={"add-item-modal-container"}>
        <h3 data-testid={"add-item-modal-title"}>
          {isNew ? t`Add item` : t`Edit item`}
        </h3>
        <Label>
          {t`Score`}: <br />
          <Input ref={scoreRef} defaultValue={score} />
        </Label>
        <Label style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {t`Value`}: <br />
          <TextArea ref={valueRef} defaultValue={value} />
        </Label>
        <PreviewActions>
          <PreviewActionButton
            data-testid={"add-item-modal-copy"}
            onClick={handleItemCopy}
          >
            <CopyIcon xlinkTitle={t`Copy as JSON`} />
          </PreviewActionButton>
          <PreviewActionButton
            data-testid={"add-item-modal-remove"}
            remove
            onClick={handleItemRemove}
          >
            <RemoveIcon xlinkTitle={t`Remove property`} />
          </PreviewActionButton>
        </PreviewActions>
        <MessageButtonWrapper>
          <Button
            label={t`Close`}
            onClick={handleClose}
            data-testid={"add-item-modal-close"}
          />
          <Button
            label={t`Save`}
            onClick={handleSave}
            data-testid={"add-item-modal-save"}
          />
        </MessageButtonWrapper>
      </MessageContent>
    </>
  );
};

export default AddOrderedItem;
