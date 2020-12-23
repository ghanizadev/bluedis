import React from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import Button from "../../../../components/Button";
import { actions } from "../../../../redux/store";
import { Error } from "../../../../redux/Types/Error";

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
  width: 400px;
  background-color: ${(props) => props.theme.background};
  color: ${(props) => props.theme.text};

  display: flex;
  flex-direction: column;

  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  border: 1px solid ${(props) => props.theme.text};
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
  margin-top: 5px;
`;

type Props = {
  message: Error;
};

const ErrorMessage: React.FC<Props> = (props) => {
  const { message} = props;
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(actions.setError(undefined))
  }
  return (
    <>
      <Container />
      <Content>
        <h3>{message.title}</h3>
        <p>{message.message}</p>
        <ButtonsWrapper>
          <Button onClick={handleClose} label="Ok" />
        </ButtonsWrapper>
      </Content>
    </>
  );
};

export default ErrorMessage;
