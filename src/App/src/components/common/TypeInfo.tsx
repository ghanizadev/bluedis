import styled from "styled-components";

export const TypeInfo = styled.div`
  background-color: ${props => props.theme.text};
  color: ${props => props.theme.background};
  width: 60px;
  text-align: center;
  font-weight: bold;
  text-transform: uppercase;
  font-size: 0.75rem;
  margin-right: 5px;
`;
