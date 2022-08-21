import styled from "styled-components";

export const Container = styled.button`
  border: none;
  height: 40px;
  padding: 3px 6px;
  margin: 0 6px;
  min-width: 80px;

  background-color: ${(props) => props.theme.foreground};

  &:hover {
    filter: brightness(0.95);
  }

  &:disabled {
    background-color: gray;
  }
`;
