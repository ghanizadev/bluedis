import "@testing-library/jest-dom";
import "jest-styled-components";

import React from "react";
import ReactDOM from "react-dom";
import { act } from "react-dom/test-utils";
import Checkbox from "../components/Checkbox";
import { ThemeWrapper } from "../utils/ThemeWrapper";
import { getByTestId } from "@testing-library/react";

let container: HTMLElement | null;

beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  container && document.body.removeChild(container);
  container = null;
});

it("<Checkbox />", () => {
  const mock = jest.fn();
  
  act(() => {
    ReactDOM.render(<ThemeWrapper><Checkbox label="My Button" onChangeValue={mock}/></ThemeWrapper>, container);
  });
  
  const input = getByTestId(container!, "checkbox-input");
  expect(input).toHaveStyleRule("background-color", "#fff");

  act(() => {
    input.dispatchEvent(new MouseEvent('click', {bubbles: true}));
  });

  expect(mock).toBeCalledTimes(1);
  expect(mock).toBeCalledWith(true);
  expect(input).toHaveStyleRule("background-color", "#2ad4c3");

  act(() => {
    input.dispatchEvent(new MouseEvent('click', {bubbles: true}));
  });

  expect(mock).toBeCalledTimes(2);
  expect(mock).toBeCalledWith(false);
  expect(input).toHaveStyleRule("background-color", "#fff");
});
