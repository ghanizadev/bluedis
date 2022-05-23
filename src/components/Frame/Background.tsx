import styled from "styled-components";

export const Background = styled.section`
  background-color: ${(props) => props.theme.background};
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;

  display: flex;
  flex-direction: column;
  box-sizing: border-box;

  color: ${(props) => props.theme.text};
`;
