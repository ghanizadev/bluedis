import styled from "styled-components";

export const Container = styled.button`
  border: none;
  height: 30px;
  padding: 5px 8px;
  margin: 0 5px;

  background-color: ${(props) => props.theme.foreground};

  &:hover {
    filter: brightness(0.95);
  }

  &:disabled {
    background-color: gray;
  }
`;
