import { createGlobalStyle } from "styled-components";
import { AppearenceSettings } from ".";

export const GlobalStyles = createGlobalStyle<{ theme: AppearenceSettings }>`
  html {
    font-size: ${(props) => props.theme.fontSize};
  } 

  * {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
    font-family: ${(props) => props.theme.fontFamily};
  }

  *:focus {
    outline: none;
  }

::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #888;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
} 
`;
