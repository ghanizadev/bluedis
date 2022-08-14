import styled from "styled-components";

export const PreviewTable = styled.table`
  padding: 8px;
  border-spacing: 0;
  width: 100%;

  & td {
    height: 30px;
  }

  & th {
    position: sticky;
    top: 0;
    background-color: ${(props) => props.theme.background};
    height: 30px;
  }
`;
