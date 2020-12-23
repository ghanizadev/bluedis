import styled from "styled-components";
import { BarButton } from "./BarButton";

export const Minimize = styled(BarButton)`
  &:hover{
    color: ${props => props.theme.foreground};
  }
`;
