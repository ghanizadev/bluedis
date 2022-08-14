import styled from "styled-components";

export const Input = styled.button<{ checked: boolean }>`
  height: 16px;
  width: 16px;
  border: 1px solid lightgray;
  transition: all 250ms ease-out;
  font-size: 0.65rem;
  background-color: ${(props) => (props.checked ? props.theme.accent : "#fff")};
  color: ${(props) => (props.checked ? props.theme.innerText : "transparent")};
`;
