import React from "react";
import { SquareButton } from "../common/SquareButton";
import { Container } from "./Container";

import { ReactComponent as RightIcon } from "../../assets/right.svg";
import { ReactComponent as LeftIcon } from "../../assets/left.svg";

const Pagination: React.FC = () => {
  return (
    <>
      {false &&
        <Container>
          <SquareButton>
            <LeftIcon />
          </SquareButton>
          <div>1</div>
          <SquareButton>
            <RightIcon />
          </SquareButton>
        </Container>
      }
    </>
  );
};

export default Pagination;
