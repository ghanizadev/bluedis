import React from "react";

import Button from "../../Button";
import { MessageBackground } from "../../common/MessageBackground";
import { MessageContent } from "../../common/MessageContent";
import { MessageButtonWrapper } from "../../common/MessageButtonWrapper";
import { TextArea } from "../../TextArea";
import { PreviewActionButton } from "../../common/PreviewActionButton";
import { PreviewActions } from "../../common/PreviewActions";
import RemoveIcon from "../../../assets/Trash";
import CopyIcon from "../../../assets/Clipboard";
import { t } from "../../../i18n";

type Props = {
  onSubmit: (value: string) => void;
  onDelete: (value: string) => void;
  onClose: () => void;
  value: { isNew: boolean; value: string };
};

const AddSetMember: React.FC<Props> = (props) => {
  const { onSubmit, onDelete, onClose, value } = props;

  const textAreaRef = React.useRef<HTMLTextAreaElement>(null);

  const handleClose = () => {
    onClose();
  };

  const handleSave = () => {
    if (!textAreaRef.current) return;
    onSubmit(textAreaRef.current.value);
  };

  const handleItemRemove = () => {
    onDelete(value.value);
  };

  const handleItemCopy = () => {
    if (textAreaRef.current?.value) {
      const text = JSON.stringify([textAreaRef.current.value]);
      navigator.clipboard.writeText(text);
    }
  };

  return (
    <>
      <MessageBackground />
      <MessageContent>
        <h3 data-testid={"add-item-modal-title"}>
          {value.isNew ? t`Add item` : t`Edit item`}
        </h3>
        <TextArea ref={textAreaRef} defaultValue={value.value} />
        {!value.isNew && (
          <PreviewActions>
            <PreviewActionButton
              data-testid="add-item-modal-copy"
              onClick={handleItemCopy}
            >
              <CopyIcon xlinkTitle={t`Copy as JSON`} />
            </PreviewActionButton>
            <PreviewActionButton
              data-testid="add-item-modal-remove"
              remove
              onClick={handleItemRemove}
            >
              <RemoveIcon xlinkTitle={t`Remove property`} />
            </PreviewActionButton>
          </PreviewActions>
        )}
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

export default AddSetMember;
