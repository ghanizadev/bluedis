import React from "react";
import Button from "../../Button";
import { MessageButtonWrapper } from "../../common/MessageButtonWrapper";
import { TextArea } from "../../TextArea";
import { Label } from "./Label";
import { Input } from "./Input";
import { MessageContent } from "../../common/MessageContent";
import { MessageBackground } from "../../common/MessageBackground";
import { PreviewActions } from "../../common/PreviewActions";
import { PreviewActionButton } from "../../common/PreviewActionButton";

import { ReactComponent as RemoveIcon } from "../../../assets/trash.svg";
import { ReactComponent as CopyIcon } from "../../../assets/clipboard.svg";

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
    onDelete(item);
  };

  const handleItemCopy = () => {
    if (textAreaRef.current?.value && inputRef.current?.value) {
      const text = JSON.stringify({
        [inputRef.current.value]: textAreaRef.current.value,
      });
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
      <MessageBackground />
      <MessageContent>
        <h4>{newItem ? "Add" : "Edit"} Item</h4>
        <Label>
          Key: <br />
          <Input
            ref={inputRef}
            disabled={!!item.key}
            defaultValue={item?.key || "New Key"}
          />
        </Label>
        <Label>
          Value: <br />
          <TextArea ref={textAreaRef} defaultValue={item?.value || "New item here..."} />
        </Label>
        {!newItem && (
          <PreviewActions>
            <PreviewActionButton
              data-testid="message-copy"
              onClick={handleItemCopy}
            >
              <CopyIcon title="Copy as JSON" />
            </PreviewActionButton>
            <PreviewActionButton
              data-testid="message-remove"
              remove
              onClick={handleItemRemove}
            >
              <RemoveIcon title="Remove property" />
            </PreviewActionButton>
          </PreviewActions>
        )}
        <MessageButtonWrapper>
          <Button label="Close" onClick={handleClose} />
          <Button label="Save" onClick={handleSave} />
        </MessageButtonWrapper>
      </MessageContent>
    </>
  );
};

export default AddHashItem;
