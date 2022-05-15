import React from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import Button from "../Button";
import { actions } from "../../redux/store";
import { Error } from "../../redux/Types/Error";
import { State } from "../../redux/Types/State";
import { MessageContent } from "../common/MessageContent";
import { MessageBackground } from "../common/MessageBackground";
import {t} from "../../i18n";

const ButtonsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin-top: 5px;
`;

const ErrorMessage = () => {
  const message = useSelector<State, Error | undefined>((state) => state.error);
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(actions.setError(undefined));
  };
  return (
    <>
      {message && (
        <>
          <MessageBackground />
          <MessageContent>
            <h3>{message.title}</h3>
            <p>{message.message}</p>
            <ButtonsWrapper>
              <Button onClick={handleClose} label={t`Ok`} />
            </ButtonsWrapper>
          </MessageContent>
        </>
      )}
    </>
  );
};

export default ErrorMessage;
