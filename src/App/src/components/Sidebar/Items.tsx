import styled from "styled-components";
import { OpenProps } from "./OpenProps";

export const Items = styled.div<OpenProps> `
  & span {
    transition: opacity 250ms ease-out; 
    opacity: ${props => props.open ? 1 : 0};
  }
`;
