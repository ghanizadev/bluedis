import styled from "styled-components";

export const MacButton = styled.button<{ color: string }>`
  width: 14px;
  height: 14px;

  border-radius: 7px;
  border: none;
  margin-right: 7px;
  background-color: ${(props) => props.color};

  display: flex;
  align-items: center;
  justify-content: center;

  & svg {
    color: #333;
  }
`;
