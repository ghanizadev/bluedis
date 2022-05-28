import styled from "styled-components";

export const LoginButton = styled.button`
  width: 100%;
  margin: 8px 0;
  border: none;
  height: 30px;
  padding: 5px 8px;

  background-color: ${(props) => props.theme.foreground};
  color: ${(props) => props.theme.innerText};

  &:hover {
    filter: brightness(0.95);
  }
`;
