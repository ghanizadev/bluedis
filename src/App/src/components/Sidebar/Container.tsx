import styled from "styled-components";

export type OpenProps = {
  open: boolean;
};
export const Container = styled.div<OpenProps> `
  min-width: ${(props) => (props.open ? "250px" : "35px")};
  max-width: ${(props) => (props.open ? "250px" : "35px")};
  height: 100%;
  padding: 5px;
  overflow-x: hidden;

  background-color: ${props => props.theme.sidebarBackground};
  transition: min-width 250ms ease-out, max-width 250ms ease-out; 
`;
