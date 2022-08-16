import styled from "styled-components";

export const MacButton = styled.button<{
  color: string;
  image: string;
  hover?: boolean;
}>`
  width: 14px;
  height: 14px;

  border-radius: 7px;
  border: none;
  margin-right: 7px;
  background-color: ${(props) => props.color};

  display: flex;
  align-items: center;
  justify-content: center;

  ${(props) => {
    if (props.hover)
      return `
            background-image: url("/${props.image}.svg");
            background-position: center;
            background-repeat: no-repeat;
          `;
  }}
`;
