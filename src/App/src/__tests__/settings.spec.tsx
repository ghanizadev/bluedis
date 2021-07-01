import "@testing-library/jest-dom";
import "jest-styled-components";
import "../utils/WindowRequireMock";

import React from "react";
import ReactDOM from "react-dom";
import { act } from "react-dom/test-utils";
import App from "../App";
import { ThemeWrapper } from "../utils/ThemeWrapper";
import { fireEvent, getByTestId, getByText } from "@testing-library/react";
import { store } from "../redux/store";
import mocks from "../utils/WindowRequireMock";

describe("<Settings />", () => {
  let container: HTMLElement | null;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container && document.body.removeChild(container);
    container = null;
  });

  it("should render", (done) => {
    act(() => {
      ReactDOM.render(
        <ThemeWrapper>
          <App />
        </ThemeWrapper>,
        container
      );
    });

    expect(container).not.toBeNull();
    done();
  });

  it("should have a menu button", (done) => {
    act(() => {
      ReactDOM.render(
        <ThemeWrapper>
          <App />
        </ThemeWrapper>,
        container
      );
    });

    const menu = getByTestId(container!, "menu-button");
    expect(menu).not.toBeNull();
    done();
  });

  it("should have a sidebar", (done) => {
    act(() => {
      ReactDOM.render(
        <ThemeWrapper>
          <App />
        </ThemeWrapper>,
        container
      );
    });

    const sidebar = getByTestId(container!, "menu-sidebar");
    expect(sidebar).not.toBeNull();
    expect(sidebar).toHaveStyleRule("width", "35px");
    done();
  });

  it("should open the sidebar", (done) => {
    act(() => {
      ReactDOM.render(
        <ThemeWrapper>
          <App />
        </ThemeWrapper>,
        container
      );
    });

    const menuButton = getByTestId(container!, "menu-button");

    act(() => {
      menuButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    const sidebar = getByTestId(container!, "menu-sidebar");
    expect(sidebar).not.toBeNull();
    expect(sidebar).toHaveStyleRule("width", "200px");
    done();
  });

  it("should open settings menu", (done) => {
    act(() => {
      ReactDOM.render(
        <ThemeWrapper>
          <App />
        </ThemeWrapper>,
        container
      );
    });

    const settingsButton = getByText(container!, "Settings").parentElement!;

    act(() => {
      settingsButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    const themeToggle = getByTestId(container!, "toggle");
    expect(themeToggle).not.toBeNull();
    expect(getByText(container!, "Appearence")).not.toBeNull();
    done();
  });

  it("should switch theme", (done) => {
    act(() => {
      ReactDOM.render(
        <ThemeWrapper>
          <App />
        </ThemeWrapper>,
        container
      );
    });

    const themeToggle = getByTestId(container!, "toggle");
    const themeInput = themeToggle.querySelector("input")!;

    act(() => {
      themeInput.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(getByTestId(container!, "frame")).toHaveStyleRule(
      "background-color",
      "#1f2f30"
    );

    done();
  });

  it("should switch font", (done) => {
    act(() => {
      ReactDOM.render(
        <ThemeWrapper>
          <App />
        </ThemeWrapper>,
        container
      );
    });

    const dropdown = container?.querySelector("select")!;

    act(() => {
      fireEvent.change(dropdown, { target: { value: "JetBrains Mono" } });
    });

    const fontFamily = store.getState().settings.appearance.fontFamily;
    expect(fontFamily).toBe("JetBrains Mono");

    done();
  });

  it("should switch font size", (done) => {
    act(() => {
      ReactDOM.render(<ThemeWrapper><App /></ThemeWrapper>, container);
    });

    const input = container?.querySelector<HTMLInputElement>('input[type="text"]')!;

    act(() => {
      fireEvent.change(input, { target: {value: "10"}});
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    });

    expect(input.value).toBe("10");
    const fontSize = store.getState().settings.appearance.fontSize;
    expect(fontSize).toBe("10pt");

    done();
  });

  it("should switch wipe user data", (done) => {
    act(() => {
      ReactDOM.render(
        <ThemeWrapper>
          <App />
        </ThemeWrapper>,
        container
      );
    });

    const button = getByText(container!, "Wipe now")!;

    act(() => {
      button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    const confirm = getByText(container!, "Confirm")!;

    act(() => {
      confirm.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(mocks.ipcRenderer.send).toHaveBeenNthCalledWith(2, 'wipeData');

    done();
  });
});
