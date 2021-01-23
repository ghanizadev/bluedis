import { createGlobalStyle } from "styled-components";
import { AppearenceSettings, ColorSchema } from ".";

export const GlobalStyles = createGlobalStyle<{ theme: AppearenceSettings & ColorSchema }>`
  html, body, #root {
    font-size: ${(props) => props.theme.fontSize};
    font-family: ${(props) => props.theme.fontFamily};
  } 

  * {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
    font-family: inherit;
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
.switch {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 20px;
}

a {
  color: ${props => props.theme.foreground};
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: .4s;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 1px;
  bottom: 1px;
  background-color: white;
  -webkit-transition: .4s;
  transition: .4s;
}

input:checked + .slider {
  background-color: ${ props => props.theme.foreground};
}

input:focus + .slider {
  box-shadow: 0 0 1px ${ props => props.theme.foreground};
}

input:checked + .slider:before {
  -webkit-transform: translateX(20px);
  -ms-transform: translateX(20px);
  transform: translateX(20px);
}

.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}
`;
