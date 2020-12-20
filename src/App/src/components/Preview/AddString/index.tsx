import React from "react";
import Button from "../../Button";
import { ButtonWrapper } from "./ButtonWrapper";
import { Container } from "./Container";
import { Content } from "./Content";
import { TextArea } from "./TextArea";

type Props = {
  onSubmit: (value: string) => void;
  onClose: () => void;
  value?: string;
};

const AddString: React.FC<Props> = (props) => {
  const { onSubmit, onClose, value } = props;

  const textAreaRef = React.useRef<HTMLTextAreaElement>(null);

  const handleClose = () => {
    onClose();
  };

  const handleSave = () => {
    if (textAreaRef.current?.value) onSubmit(textAreaRef.current.value);
  };

  return (
    <Container>
      <Content>
        <h3>Add/Edit Item</h3>
        <TextArea ref={textAreaRef}>{value}</TextArea>
        <ButtonWrapper>
          <Button label="Close" onClick={handleClose} />
          <Button label="Save" onClick={handleSave} />
        </ButtonWrapper>
      </Content>
    </Container>
  );
};

export default AddString;
