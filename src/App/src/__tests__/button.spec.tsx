import "@testing-library/jest-dom";
import "jest-styled-components";

import React from "react";
import ReactDOM from "react-dom";
import { act } from "react-dom/test-utils";
import Button from "../components/Button";
import { ThemeWrapper } from "../utils/ThemeWrapper";

let container: HTMLElement | null;

beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  container && document.body.removeChild(container);
  container = null;
});

it("<Button />", () => {
  const mock = jest.fn();

  act(() => {
    ReactDOM.render(<ThemeWrapper><Button label="My Button" onClick={mock}/></ThemeWrapper>, container);
  })

  const button = container?.querySelector("button")!;
  const label = container?.querySelector("span")!;

  expect(button).toHaveStyleRule("background-color", "#2ad4c3");
  expect(label).toHaveStyleRule("color", "#fff");

  act(() => {
    button.dispatchEvent(new MouseEvent('click', {bubbles: true}));
  });

  expect(mock).toBeCalledTimes(1);
});
