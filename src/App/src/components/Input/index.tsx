import styled from "styled-components";

const Input = styled.input`
  height: 30px;
  padding: 3px 5px;
  margin: 0 5px;
  border: none;
  background-color: transparent !important;
  border-bottom: 2px solid ${({theme}) => theme.foreground};
  color: ${({theme}) => theme.text};
`;

export default Input;