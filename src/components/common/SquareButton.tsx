import styled from "styled-components";

export const SquareButton = styled.button<{
  remove?: boolean;
  inAction?: boolean;
}>`
  width: 24px;
  height: 24px;
  margin: 0 8px;

  border: none;
  background-color: transparent;
  color: ${(props) => props.theme.text};

  & svg {
    stroke-dasharray: ${(props) => (props.inAction ? "60" : "unset")};
    stroke-dashoffset: ${(props) => (props.inAction ? "60" : "unset")};
    animation: ${(props) =>
      props.inAction ? "dash 1000ms linear forwards" : "unset"};
  }

  @keyframes dash {
    to {
      stroke-dashoffset: 0;
    }
  }

  &:hover {
    color: ${(props) => (props.remove ? "tomato" : props.theme.foreground)};
  }
`;
