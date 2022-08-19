import styled from "styled-components";

export const MessageContent = styled.div`
  width: 400px;
  background-color: ${(props) => props.theme.sidebarBackground};
  color: ${(props) => props.theme.text};
  position: absolute;
  padding: 15px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  transition: height 250ms ease-out;
  box-shadow: 0 0 100px 25px rgba(0, 0, 0, 0.5);

  display: flex;
  flex-direction: column;
  z-index: 10;
`;
