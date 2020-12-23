import React from "react";
import Button from "../../Button";
import { TextArea } from "../../TextArea";
import { MessageBackground } from "../../common/MessageBackground";
import { MessageContent } from "../../common/MessageContent";
import { MessageButtonWrapper } from "../../common/MessageButtonWrapper";
import { PreviewActionButton } from "../../common/PreviewActionButton";
import { PreviewActions } from "../../common/PreviewActions";

import {ReactComponent as RemoveIcon} from "../../../assets/trash.svg";
import {ReactComponent as CopyIcon} from "../../../assets/clipboard.svg";

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
      <MessageBackground />
      <MessageContent>
        <h3>Add/Edit Item</h3>
        <TextArea ref={textAreaRef}>{value?.value}</TextArea>
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

export default AddListMember;
