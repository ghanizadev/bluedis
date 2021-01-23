import styled from "styled-components";

export const PreviewTableRow = styled.tr`
  cursor: pointer;
  overflow: hidden;

  &:hover {
    background-color: ${(props) => props.theme.foreground};
    color: ${(props) => props.theme.innertext};
  }
`;
