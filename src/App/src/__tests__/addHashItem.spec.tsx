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

describe("<HashItem />", () => {
  let container: HTMLElement | null;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container && document.body.removeChild(container);
    container = null;
  });

  it("should open/edit hash item", async () => {
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
            key: "new:hash",
            type: "hash",
            value: {
              "new key": "new value",
            },
          },
        ])
      );

      store.dispatch(actions.setConnected(true));
    });

    const items = getAllByTestId(container!, "item-table-row");

    const hash = items.find((item) => !!getByText(item, "hash"))!;
    expect(hash).not.toBeNull();

    const button = getByTitle(hash, "Click to view");

    act(() => {
      fireEvent.click(button, { bubbles: true });
    });
    const preview = getByTestId(container!, "preview");

    expect(preview).not.toBeNull();
    expect(preview).toHaveStyleRule("width", "350px");
    expect(preview?.querySelector("h1")?.textContent).toBe("new:hash");
    expect(getByText(preview, "new value")).not.toBeNull();
    expect(getByText(preview, "new key")).not.toBeNull();

    const firstItem = getByText(preview, "new value")?.parentElement;
    expect(firstItem).not.toBeNull();

    act(() => {
      fireEvent.click(firstItem!, { bubbles: true });
    });

    expect(
      Array.from(container!.querySelectorAll("h3")).find(
        (el) => el.textContent === "Edit Item"
      )
    ).not.toBeNull();

    const editValue = preview.querySelector("textarea")!;
    const editKey = preview.querySelector("input")!;

    expect(editValue).not.toBeNull();
    expect(editKey).not.toBeNull();

    act(() => {
      fireEvent.change(editValue, {
        target: { value: "some other key value" },
      });
    });

    expect(editValue.value).toBe("some other key value");

    const copyItemButton = getByTestId(container!, "message-copy")!;
    expect(copyItemButton).not.toBeNull();

    act(() => {
      fireEvent.click(copyItemButton, { bubbles: true });
    });

    expect(mocks.writeText).toHaveBeenLastCalledWith(
      JSON.stringify({ "new key": "some other key value" })
    );

    const saveItemButton = getByText(container!, "Save")!;
    expect(saveItemButton).not.toBeNull();

    act(() => {
      fireEvent.click(saveItemButton, { bubbles: true });
    });

    expect(mocks.ipcRenderer.send).toHaveBeenLastCalledWith(
      "addHashMember",
      "new:hash",
      {"new key": "some other key value"},
    );

    act(() => {
      fireEvent.click(firstItem!, { bubbles: true });
    });

    const closeItemButton = getByText(container!, "Close");

    act(() => {
      fireEvent.click(closeItemButton, { bubbles: true });
    });

    expect(container!.querySelectorAll("h3").length).toBe(0);

    act(() => {
      fireEvent.click(firstItem!, { bubbles: true });
    });

    const deleteItemButton = getByTestId(container!, "message-remove");
    expect(deleteItemButton).not.toBeNull();

    act(() => {
      fireEvent.click(deleteItemButton, { bubbles: true });
    });

    expect(mocks.ipcRenderer.send).toHaveBeenLastCalledWith(
      "removeHashMember",
      "new:hash",
      "new key"
    );

    const addButton = getByTestId(preview, "item-add");
    await act(async () => {
      fireEvent.click(addButton, { bubbles: true });
    });

    expect(getByText(container!, "Add Item")).not.toBeNull();

    const closeAddOverlay = getByText(container!, "Close");

    await act(async () => {
      fireEvent.click(closeAddOverlay, { bubbles: true });
    });

    expect(container?.querySelectorAll("h3").length).toBe(0);

    act(() => {
      fireEvent.click(addButton, { bubbles: true });
    });

    let addItemValue = preview.querySelector("textarea")!;
    expect(addItemValue).not.toBeNull();

    let addItemKey = preview.querySelector("input")!;
    expect(addItemKey).not.toBeNull();

    act(() => {
      fireEvent.change(addItemValue, { target: { value: "new another item" } });
    });

    act(() => {
      fireEvent.change(addItemKey, { target: { value: "another key" } });
    });

    addItemValue = preview.querySelector("textarea")!;
    expect(addItemValue.value).toBe("new another item");
    addItemKey = preview.querySelector("input")!;
    expect(addItemKey.value).toBe("another key");

    const saveMemberButton = getByText(container!, "Save");

    await act(async () => {
      fireEvent.click(saveMemberButton, { bubbles: true });
    });

    expect(mocks.ipcRenderer.send).toHaveBeenLastCalledWith(
      "addHashMember",
      "new:hash",
      { "another key": "new another item" }
    );

    const copyButton = getByTestId(preview, "item-copy");
    await act(async () => {
      fireEvent.click(copyButton, { bubbles: true });
      await waitFor(
        () =>
          expect(mocks.writeText).toBeCalledWith(
            JSON.stringify({
              "new:hash": { "new key": "new value" },
            })
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

          expect(mocks.ipcRenderer.send).not.toHaveBeenLastCalledWith(
            "deleteKey",
            "new:hash"
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
          expect(mocks.ipcRenderer.send).toHaveBeenLastCalledWith(
            "deleteKey",
            "new:hash"
          );
        },
        { timeout: 1200 }
      );
    });
  });
});
