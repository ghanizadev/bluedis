import styled from "styled-components";

type InputProps = {
  checked: boolean;
};

export const Input = styled.button<InputProps> `
  height: 16px;
  width: 16px;
  border: 1px solid lightgray;
  transition: all 250ms ease-out;
  font-size: 0.65rem;
  background-color: ${(props) => props.checked ? props.theme.foreground : "#fff"};
  color: ${(props) => (props.checked ? props.theme.innertext : "transparent")};
`;
