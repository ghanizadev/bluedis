import "@testing-library/jest-dom";
import "jest-styled-components";

import React from "react";
import ReactDOM from "react-dom";
import { act } from "react-dom/test-utils";
import Dropdown from "../components/Dropdown";
import { ThemeWrapper } from "../utils/ThemeWrapper";
import { fireEvent } from "@testing-library/react";

let container: HTMLElement | null;

beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  container && document.body.removeChild(container);
  container = null;
});

it("<Dropdown />", () => {
  const mock = jest.fn();
  
  act(() => {
    ReactDOM.render(<ThemeWrapper><Dropdown items={["item A", "item B"]} onChange={mock}/></ThemeWrapper>, container);
  });
  
  const select = container?.querySelector("select")!;
  expect(select).toHaveStyleRule("background-color", "#2ad4c3");
  expect(select.value).toBe("item A");

  act(() => {
    fireEvent.change(select, { target: {value: "item B"} })
  });

  expect(select.value).toBe("item B")
  expect(mock).toBeCalledWith("item B");

  act(() => {
    fireEvent.change(select, { target: {value: "item A"} })
  });

  expect(select.value).toBe("item A")
  expect(mock).toBeCalledWith("item A");

});
