import styled from "styled-components";

export type OpenProps = {
  open: boolean;
};
export const Container = styled.div<OpenProps>`
  width: ${(props) => (props.open ? "200px" : "35px")};
  ${(props) => (props.open ? "min-width: 200px;" : "min-width: unset;")};
  height: 100%;
  padding: 5px;
  overflow-x: hidden;

  background-color: ${(props) => props.theme.sidebarBackground};
  transition: all 250ms ease-out;
`;
