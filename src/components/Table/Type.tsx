import styled from "styled-components";

export const Type = styled.div`
  line-height: 20px;
  background-color: ${(props) => props.theme.text};
  color: ${(props) => props.theme.background};
  width: 60px;
  text-align: center;
  margin: auto;
  font-weight: bold;
  text-transform: uppercase;
  font-size: 0.75rem;
`;
