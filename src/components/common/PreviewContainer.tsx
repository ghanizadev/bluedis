import styled from "styled-components";

export const PreviewContainer = styled.div`
  flex: 1;
  background-color: ${(props) => props.theme.background};
  flex-basis: 0;
  overflow: hidden auto;
`;
