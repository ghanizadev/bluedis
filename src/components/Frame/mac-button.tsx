import styled from "styled-components";

export const MacButton = styled.button<{ color: string }>`
  width: 10px;
  height: 10px;

  border-radius: 5px;
  border: none;
  margin-right: 5px;
  background-color: ${(props) => props.color};
`;
