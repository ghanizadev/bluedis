import React, {useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import Button from "../Button";
import { actions } from "../../redux/store";
import { State } from "../../redux/Types/State";
import { MessageContent } from "../common/MessageContent";
import { MessageBackground } from "../common/MessageBackground";
import { Confirmation } from "../../redux/Types/Confirmation";

const ButtonsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin-top: 5px;
`;

const ErrorMessage = () => {
  const confirm = useSelector<State, Confirmation | undefined>(
    (state) => state.confirmation
  );
  const dispatch = useDispatch();
  const translation = useSelector<State, {[key: string]: string}>(state => state.settings.translation)

  const handleConfirm = () => {
    confirm && confirm.onConfirm();
    dispatch(actions.setConfirmation(undefined));
  };

  const handleCancel = () => {
    if (confirm?.onCancel) confirm?.onCancel();
    dispatch(actions.setConfirmation(undefined));
  };

  return (
    <>
      {confirm && (
        <>
          <MessageBackground />
          <MessageContent data-testid="confirmation-message">
            <h3>{confirm.title}</h3>
            <br />
            <p>{confirm.message}</p>
            <ButtonsWrapper>
              <Button
                onClick={handleCancel}
                label={translation.cancel}
              />
              <Button
                onClick={handleConfirm}
                label={translation.confirm}
              />
            </ButtonsWrapper>
          </MessageContent>
        </>
      )}
    </>
  );
};

export default ErrorMessage;
