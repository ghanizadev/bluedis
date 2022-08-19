import styled from "styled-components";

export const ButtonWrapper = styled.div< { windows?: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: flex-end;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${props => props.windows ? "right: 6px;" : ""}
`;
