import React from "react";
import Button from "../../Button";
import { MessageBackground } from "../../common/MessageBackground";
import { MessageContent } from "../../common/MessageContent";
import { MessageButtonWrapper } from "../../common/MessageButtonWrapper";
import { TextArea } from "../../TextArea";
import { PreviewActionButton } from "../../common/PreviewActionButton";
import { PreviewActions } from "../../common/PreviewActions";

import { ReactComponent as RemoveIcon } from "../../../assets/trash.svg";
import { ReactComponent as CopyIcon } from "../../../assets/clipboard.svg";
import {useSelector} from "react-redux";
import {State} from "../../../redux/Types/State";

type Props = {
  onSubmit: (oldValue: string, newValue: string) => void;
  onDelete: (value: string) => void;
  onClose: () => void;
  value: { isNew: boolean; value: string };
};

const AddSetMember: React.FC<Props> = (props) => {
  const { onSubmit, onDelete, onClose, value } = props;
  const translation = useSelector<State, {[key: string]: string}>(state => state.settings.translation);

  const textAreaRef = React.useRef<HTMLTextAreaElement>(null);

  const handleClose = () => {
    onClose();
  };

  const handleSave = () => {
    if (textAreaRef.current?.value)
      onSubmit(value.isNew ? "" : value.value, textAreaRef.current.value);
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
        <h3>{value.isNew ? translation.additem : translation.edititem}</h3>
        <TextArea ref={textAreaRef} defaultValue={value.value} />
        {!value.isNew && (
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

export default AddSetMember;
