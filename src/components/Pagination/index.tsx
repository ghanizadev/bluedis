import React, {FC} from "react";
import { SquareButton } from "../common/SquareButton";
import { Container } from "./Container";

import { ReactComponent as RightIcon } from "../../assets/right.svg";
import { ReactComponent as LeftIcon } from "../../assets/left.svg";
import { State } from "../../redux/Types/State";
import { useSelector } from "react-redux";

const Pagination: FC = () => {
  const pagination = useSelector<State, {cursor: number, count: number}>(state => state.query);
  
  return (
    <>
      <Container>
        <SquareButton>
          <LeftIcon />
        </SquareButton>
        <div>1</div>
        <SquareButton>
          <RightIcon />
        </SquareButton>
        <span>
          showing {pagination.cursor} of {pagination.count}
        </span>
      </Container>
    </>
  );
};

export default Pagination;
