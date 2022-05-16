import styled from "styled-components";

export const Data = styled.td`
  border-bottom: 1px solid ${(props) => props.theme.accent};
  height: 40px;
  max-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  & span {
    cursor: pointer;
  }
`;
