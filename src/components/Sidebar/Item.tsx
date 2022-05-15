import styled from "styled-components";

export const Item = styled.button`
  border: none;
  background-color: transparent;
  padding: 0;
  margin: 15px 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  cursor: pointer;
  transition: all 100ms ease-out;
  width: 200px;

  color: ${props => props.theme.text};

  & span {
    margin-left: 5px;
    font-size: 1rem;
  }

  &:hover {
    transform: scale(1.05);
  }
`;
