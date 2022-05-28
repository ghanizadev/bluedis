import styled from "styled-components";

export const Input = styled.input`
  height: 40px;
  padding: 3px 6px;
  margin: 0 6px;
  border: none;
`;

export const InputAlt = styled(Input)`
  background-color: transparent !important;
  border-bottom: 2px solid ${({ theme }) => theme.foreground};
  color: ${({ theme }) => theme.text};
  padding: 0 3px;
`;

export default Input;
