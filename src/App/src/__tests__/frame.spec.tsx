import "@testing-library/jest-dom";
import "jest-styled-components";
import "../utils/WindowRequireMock";

import React from "react";
import ReactDOM from "react-dom";
import { act } from "react-dom/test-utils";
import Frame from "../components/Frame";
import { ThemeWrapper } from "../utils/ThemeWrapper";
import { getByTestId } from "@testing-library/react";
import mocks from "../utils/WindowRequireMock";

let container: HTMLElement | null;

beforeEach(() => {
  window.require = require("electron");
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  container && document.body.removeChild(container);
  container = null;
});

it("<Frame />", () => {
  act(() => {
    ReactDOM.render(<ThemeWrapper><Frame /></ThemeWrapper>, container);
  });
  
  const frame = getByTestId(container!, "frame");
  expect(frame).toHaveStyleRule("background-color", "#fdfdfd");

  expect(frame.querySelectorAll("button")).toHaveLength(3);
  expect(frame.querySelector("span")?.textContent).toBe("Bluedis");
  expect(frame.querySelector("img")).toHaveAttribute("src", "/icon.png");

  const closeButton = getByTestId(frame, "frame-close");

  act(() => {
    closeButton.dispatchEvent(new MouseEvent("click", {bubbles: true}))
  });

  expect(mocks.ipcRenderer.send).toBeCalledWith("close");

  const minimizeButton = getByTestId(frame, "frame-minimize");

  act(() => {
    minimizeButton.dispatchEvent(new MouseEvent("click", {bubbles: true}))
  });

  expect(mocks.ipcRenderer.send).toBeCalledWith("minimize");

  const maximizeButton = getByTestId(frame, "frame-maximize");

  act(() => {
    maximizeButton.dispatchEvent(new MouseEvent("click", {bubbles: true}))
  });

  expect(mocks.ipcRenderer.send).toBeCalledWith("maximize");

});
