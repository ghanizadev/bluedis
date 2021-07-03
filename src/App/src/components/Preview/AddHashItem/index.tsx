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
import {useSelector} from "react-redux";
import {State} from "../../../redux/Types/State";

type Props = {
  onSubmit: (value: { key: string; value: string }) => void;
  onDelete: (value: { key: string; value: string }) => void;
  onClose: () => void;
  item: { key: string; value: string };
  newItem?: boolean;
};

const AddHashItem: React.FC<Props> = (props) => {
  const { onSubmit, onDelete, onClose, item, newItem } = props;
  const translation = useSelector<State, {[key: string]: string}>(state => state.settings.translation);

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
        <h4>{newItem ? translation.additem : translation.edititem}</h4>
        <Label>
          {translation.key}: <br />
          <Input
            ref={inputRef}
            disabled={!!item.key}
            defaultValue={item?.key || "New Key"}
          />
        </Label>
        <Label>
          {translation.value}: <br />
          <TextArea ref={textAreaRef} defaultValue={item?.value || "New item here..."} />
        </Label>
        {!newItem && (
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
        )}
        <MessageButtonWrapper>
          <Button label={translation.close} onClick={handleClose} />
          <Button label={translation.save} onClick={handleSave} />
        </MessageButtonWrapper>
      </MessageContent>
    </>
  );
};

export default AddHashItem;
