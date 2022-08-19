import styled from "styled-components";

import { BarButton } from "./BarButton";

export const Close = styled(BarButton)<{ image: string }>`
  background-color: ${props => props.theme.text};
  mask-image: url("/${props => props.image}.svg");
  mask-repeat: no-repeat;
  mask-position: center;
  
  &:hover {
    background-color: tomato;
  }
`;
