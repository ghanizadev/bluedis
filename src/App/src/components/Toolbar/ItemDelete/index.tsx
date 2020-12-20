import React from "react";
import Button from "../../Button";
import { ButtonsWrapper } from "./ButtonsWrapper";
import { Container } from "./Container";
import { Content } from "./Content";
import { Title } from "./Title";
import { useSelector } from "react-redux";
import { State } from "../../../redux/Types/State";

type Props = {
  onCancel: () => void;
  onConfirm: () => void;
};

const ItemDelete: React.FC<Props> = (props) => {
  const { onConfirm, onCancel } = props;
  const selected = useSelector<State, string[]>(state => state.selected);

  const handleCancel = () => {
    onCancel();
  };

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <Container>
      <Content>
        <Title>Attention!</Title>
        <p>Do you really want to delete <strong>{selected.length > 1 ? `ALL THESE ${selected.length} KEYS` : "THIS KEY"}</strong>?</p>
        <br />
        <ButtonsWrapper>
          <Button onClick={handleCancel} label="Cancel" />
          <Button onClick={handleConfirm} label="Yes, I do" />
        </ButtonsWrapper>
      </Content>
    </Container>
  );
};

export default ItemDelete;
