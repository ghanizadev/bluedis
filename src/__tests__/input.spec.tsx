
import "@testing-library/jest-dom";
import { fireEvent } from "@testing-library/react";
import "jest-styled-components";

import React from "react";
import ReactDOM from "react-dom";
import { act } from "react-dom/test-utils";
import Input from "../components/Input";
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

it("<Input />", () => {
  const mock = jest.fn();

  act(() => {
    ReactDOM.render(<ThemeWrapper><Input onChange={mock}/></ThemeWrapper>, container);
  })

  const input = container?.querySelector("input")!;

  act(() => {
    fireEvent.change(input, {target: {value: "some value"}})
  });

  expect(mock).toBeCalledTimes(1);
});
