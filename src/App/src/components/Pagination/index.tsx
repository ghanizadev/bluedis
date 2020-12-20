import React from "react";
import styled from "styled-components";

import { ReactComponent as RightIcon } from "../../assets/right.svg";
import { ReactComponent as LeftIcon } from "../../assets/left.svg";
import { SquareButton } from "../Preview/SquareButton";

const Container = styled.div`
  align-self: flex-end;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 80px;
  align-items: center;
  text-align: justify;
  font-size: 1.15rem;
`;

const Pagination: React.FC = () => {
  return (
    <Container>
      <SquareButton>
        <LeftIcon />
      </SquareButton>
      <div>1</div>
      <SquareButton>
        <RightIcon />
      </SquareButton>
    </Container>
  );
};

export default Pagination;
