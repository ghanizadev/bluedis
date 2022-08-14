import styled from "styled-components";

export const BarButton = styled.button`
  height: 20px;
  width: 20px;
  margin-left: 5px;
  border: none;
  color: ${(props) => props.theme.text};
  background-color: transparent;
  font-size: 1.35rem;

  display: flex;
  align-items: center;
  justify-content: center;

  text-align: center;
  line-height: 20px;

  transition: all 250ms ease-out;

  -webkit-app-region: no-drag;
`;
