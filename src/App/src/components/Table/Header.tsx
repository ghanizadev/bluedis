import styled from "styled-components";

export const Header = styled.th`
  height: 30px;
  background-color: ${(props) => props.theme.foreground};
  color: ${(props) => props.theme.innertext};
`;
