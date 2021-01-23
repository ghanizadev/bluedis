import styled from "styled-components";

export const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: nowrap;
  margin: 15px 0; 

  & h1 {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;
