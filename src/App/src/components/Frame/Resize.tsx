import styled from "styled-components";
import { BarButton } from "./BarButton";

export const Resize = styled(BarButton)`
  &:hover{
    color: ${props => props.theme.foreground};
  }
`;
