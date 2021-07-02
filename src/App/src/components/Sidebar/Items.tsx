import styled from "styled-components";
import { OpenProps } from "./Container";

export const Items = styled.div<OpenProps> `
  & span {
    transition: opacity 250ms ease-out;
    white-space: nowrap;
    opacity: ${props => props.open ? 1 : 0};
  }
`;
