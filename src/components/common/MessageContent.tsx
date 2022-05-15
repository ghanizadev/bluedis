import styled from "styled-components";

export const MessageContent = styled.div`
  width: 500px;
  background-color: ${(props) => props.theme.sidebarBackground};
  color: ${(props) => props.theme.text};
  border: 1px solid ${(props) => props.theme.text};
  position: absolute;
  padding: 15px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  transition: height 250ms ease-out;

  display: flex;
  flex-direction: column;
  z-index: 10;
`;