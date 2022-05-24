import React from "react";

import Button from "../../Button";
import { TextArea } from "../../TextArea";
import { MessageBackground } from "../../common/MessageBackground";
import { MessageContent } from "../../common/MessageContent";
import { MessageButtonWrapper } from "../../common/MessageButtonWrapper";
import { PreviewActionButton } from "../../common/PreviewActionButton";
import { PreviewActions } from "../../common/PreviewActions";
import { ReactComponent as RemoveIcon } from "../../../assets/trash.svg";
import { ReactComponent as CopyIcon } from "../../../assets/clipboard.svg";
import { t } from "../../../i18n";

type Props = {
  onSubmit: (value: string, index: number) => void;
  onDelete: (value: string, index: number) => void;
  onClose: () => void;
  value: { value: string; index: number };
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
    if (value && textAreaRef.current) {
      const currentValue = textAreaRef.current.value;
      const text = JSON.stringify({ [value.index]: currentValue });
      navigator.clipboard.writeText(text);
    }
  };
  const handleItemRemove = () => {
    if (value) onDelete(value.value, value.index);
  };

  return (
    <>
      <MessageBackground />
      <MessageContent data-testid={"add-item-modal"}>
        <h3>{props.value.index < 0 ? t`Add item` : t`Edit item`}</h3>
        <TextArea ref={textAreaRef} defaultValue={value?.value} />
        <PreviewActions>
          <PreviewActionButton
            data-testid="add-item-modal-copy"
            onClick={handleItemCopy}
          >
            <CopyIcon title={t`Copy as JSON`} />
          </PreviewActionButton>
          <PreviewActionButton
            data-testid="add-item-modal-remove"
            remove
            onClick={handleItemRemove}
          >
            <RemoveIcon title={t`Remove property`} />
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

export default AddListMember;
