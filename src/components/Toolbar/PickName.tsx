import React from "react";
import styled from "styled-components";

import Button from "../Button";
import { Input } from "../Input";
import { t } from "../../i18n";

const Container = styled.div`
  position: absolute;
  top: 40px;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.25);
  z-index: 9;
`;

const Content = styled.div`
  padding: 15px;
  background-color: ${(props) => props.theme.background};
  color: ${(props) => props.theme.text};

  display: flex;
  flex-direction: column;

  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  z-index: 10;

  & #input-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    flex: 1;
  }

  & span {
    white-space: nowrap;
  }
`;

const ButtonsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin-top: 12px;
  margin-right: -6px;
`;

const InputName = styled(Input)`
  border: none;
  color: ${(props) => props.theme.text};
  border-bottom: 1px solid ${(props) => props.theme.foreground};
  background-color: transparent;
`;

type Props = {
  onConfirm: (value: string) => void;
  onCancel: () => void;
};
const PickName: React.FC<Props> = (props) => {
  const { onConfirm, onCancel } = props;

  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleConfirm = () => {
    inputRef.current && onConfirm(inputRef.current.value);
  };
  const handleCancel = () => {
    onCancel();
  };

  return (
    <>
      <Container />
      <Content data-testid={"pick-container"}>
        <div id="input-container">
          <span>{t`Pick a name`}: </span>
          <InputName data-testid={"pick-input"} ref={inputRef} />
        </div>
        <ButtonsWrapper>
          <Button
            label={t`Cancel`}
            onClick={handleCancel}
            data-testid={"pick-cancel"}
          />
          <Button
            label={t`Confirm`}
            onClick={handleConfirm}
            data-testid={"pick-confirm"}
          />
        </ButtonsWrapper>
      </Content>
    </>
  );
};

export default PickName;
