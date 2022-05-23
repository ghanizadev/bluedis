import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";

import { State } from "../../redux/Types/State";

import Spinner from "./Spinner";

const Container = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.6);

  display: grid;
  place-items: center;
`;

const Loading: React.FC = () => {
  const isLoading = useSelector<State, boolean>((state) => state.isLoading);

  return (
    <>
      {isLoading && (
        <Container data-testid={"loading"}>
          <Spinner />
        </Container>
      )}
    </>
  );
};

export default Loading;
