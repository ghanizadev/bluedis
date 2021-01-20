import styled from "styled-components";

export const Container = styled.section<{ open: boolean; }> `
  width: ${(props) => (props.open ? "350px" : "0")};
  opacity: ${(props) => (props.open ? 1 : 0)};
  padding: ${(props) => (props.open ? "8px" : 0)};
  overflow-x: hidden;
  height: 100%;

  background-color: ${(props) => props.theme.sidebarBackground};
  transition: opacity 350ms, width 350ms, padding 350ms;

  display: flex;
  flex-direction: column;
`;
