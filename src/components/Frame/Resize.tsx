import styled from "styled-components";

import { BarButton } from "./BarButton";

export const Resize = styled(BarButton)<{ image: string }>`
  background-color: ${(props) => props.theme.text};
  mask-image: url("/${(props) => props.image}.svg");
  mask-repeat: no-repeat;
  mask-position: center;

  &:hover {
    background-color: ${(props) => props.theme.foreground};
  }

  & svg {
    width: 16px;
    height: 16px;
  }
`;
