import React, { FC } from "react";
import styled from "styled-components";

const Container = styled.section`
  padding: 0 8px;
`;

const View: FC<any> = (props) => {
  return <Container>{props.children}</Container>;
};

export default View;
