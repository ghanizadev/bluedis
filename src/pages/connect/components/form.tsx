import styled from "styled-components";

export const Form = styled.div`
  display: flex;
  flex-direction: column;
  grid-column: 1;
  grid-row: 1;
  padding: 0 15px 0 0;

  & input {
    width: 100%;
    margin-bottom: 5px;
    height: 26px;
    background-color: transparent;
    border: none;
    color: ${(props) => props.theme.text};
    border-bottom: 1px solid ${(props) => props.theme.foreground};
  }
`;
