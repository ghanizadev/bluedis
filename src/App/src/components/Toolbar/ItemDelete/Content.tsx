import styled from "styled-components";

export const Content = styled.div`
  width: 500px;
  background-color: ${(props) => props.theme.sidebarBackground};
  border: 1px solid ${(props) => props.theme.text};
  position: relative;
  padding: 8px;
  padding-bottom: 58px;

  display: flex;
  flex-direction: column;

  & span {
    text-align: center;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;
