import "@testing-library/jest-dom";
import "jest-styled-components";
import "../utils/WindowRequireMock";

import React from "react";
import ReactDOM from "react-dom";
import { act } from "react-dom/test-utils";
import App from "../App";
import { ThemeWrapper } from "../utils/ThemeWrapper";
import {
  fireEvent,
  getAllByTestId,
  getByTestId,
  getByText,
  getByTitle,
  waitFor,
} from "@testing-library/react";
import { actions, store } from "../redux/store";
import mocks from "../utils/WindowRequireMock";

describe("<StringItem/ >", () => {
  let container : HTMLElement | null;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container && document.body.removeChild(container);
    container = null;
  });

  it("should open/edit string item", async () => {
    act(() => {
      ReactDOM.render(
        <ThemeWrapper>
          <App />
        </ThemeWrapper>,
        container
      );
    });

    act(() => {
      store.dispatch(
        actions.setData([
          {
            key: "new:string",
            type: "string",
            value: "some value",
          },
        ])
      );
      store.dispatch(actions.setConnected(true));
    });

    const items = getAllByTestId(container!, "item-table-row");

    const string = items.find((item) => !!getByText(item, "string"));
    expect(string).not.toBeNull();

    const button = getByTitle(string!, "Click to view");
    let preview = getByTestId(container!, "preview");

    expect(button).not.toBeNull();
    expect(preview).not.toBeNull();
    expect(preview).toHaveStyleRule("width", "0");

    act(() => {
      fireEvent.click(button, { bubbles: true });
    });

    preview = getByTestId(container!, "preview");
    expect(preview).toHaveStyleRule("width", "350px");
    expect(preview.querySelector("h1")?.textContent).toBe("new:string");
    expect(preview.querySelector("textarea")?.value).toBe("some value");

    act(() => {
      fireEvent.change(preview.querySelector("textarea")!, {
        target: { value: "some other value" },
      });
    });

    expect(preview.querySelector("textarea")?.value).toBe("some other value");

    const saveButton = getByTestId(preview, "item-save");
    await act(async () => {
      fireEvent.click(saveButton, { bubbles: true });
      await new Promise((r) => setTimeout(r, 3100));
    });

    expect(mocks.ipcRenderer.send).toHaveBeenLastCalledWith(
      "changeString",
      "new:string",
      "some other value"
    );

    const copyButton = getByTestId(preview, "item-copy");
    await act(async () => {
      fireEvent.click(copyButton, { bubbles: true });
      await waitFor(
        () =>
          expect(mocks.writeText).toBeCalledWith(
            JSON.stringify({ "new:string": "some value" })
          ),
        { timeout: 100 }
      );
    });

    let removeButton = getByTestId(preview, "item-remove");
    await act(async () => {
      fireEvent.mouseDown(removeButton, { bubbles: true });
      await waitFor(
        () => {
          fireEvent.mouseUp(removeButton, { bubbles: true });

          expect(mocks.ipcRenderer.send).not.toHaveBeenNthCalledWith(
            3,
            "deleteKey",
            "new:string"
          );
        },
        { timeout: 800 }
      );
    });

    removeButton = getByTestId(preview, "item-remove");
    await act(async () => {
      fireEvent.mouseDown(removeButton, { bubbles: true });
      setTimeout(() => {
        fireEvent.mouseUp(removeButton, { bubbles: true });
      }, 1100);
      await waitFor(
        () => {
          expect(mocks.ipcRenderer.send).toHaveBeenNthCalledWith(
            3,
            "deleteKey",
            "new:string"
          );
        },
        { timeout: 1200 }
      );
    });
  });
})