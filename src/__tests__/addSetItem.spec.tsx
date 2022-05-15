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

describe("<SetItem />", () => {
  let container: HTMLElement | null;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container && document.body.removeChild(container);
    container = null;
  });

  it("should open/edit set item", async () => {
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
            key: "new:set",
            type: "set",
            value: ["first member"],
          },
        ])
      );

      store.dispatch(actions.setConnected(true));
    });

    const items = getAllByTestId(container!, "item-table-row");

    const set = items.find((item) => !!getByText(item, "set"))!;
    expect(set).not.toBeNull();

    const button = getByTitle(set, "Click to view");

    act(() => {
      fireEvent.click(button, { bubbles: true });
    });
    const preview = getByTestId(container!, "preview");

    expect(preview).not.toBeNull();
    expect(preview).toHaveStyleRule("width", "350px");
    expect(preview?.querySelector("h1")?.textContent).toBe("new:set");
    expect(getByText(preview, "first member")).not.toBeNull();

    //edit assertion
    const firstItem = getByText(preview, "first member")?.parentElement;
    expect(firstItem).not.toBeNull();

    act(() => {
      fireEvent.click(firstItem!, { bubbles: true });
    });

    expect(
      Array.from(container!.querySelectorAll("h3")).find(
        (el) => el.textContent === "Edit Item"
      )
    ).not.toBeNull();

    const editArea = container?.querySelector("textarea")!;
    expect(editArea).not.toBeNull();

    act(() => {
      fireEvent.change(editArea, { target: { value: "some other member" } });
    });

    expect(editArea.value).toBe("some other member");

    const copyItemButton = getByTestId(container!, "message-copy")!;
    expect(copyItemButton).not.toBeNull();

    act(() => {
      fireEvent.click(copyItemButton, { bubbles: true });
    });

    expect(mocks.writeText).toHaveBeenLastCalledWith(
      JSON.stringify(["some other member"])
    );

    const saveItemButton = getByText(container!, "Save")!;
    expect(saveItemButton).not.toBeNull();

    act(() => {
      fireEvent.click(saveItemButton, { bubbles: true });
    });

    expect(mocks.ipcRenderer.send).toHaveBeenLastCalledWith(
      "addSetMember",
      "new:set",
      "some other member"
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
      "removeSetMember",
      "new:set",
      "first member"
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

    await act(async () => {
      fireEvent.click(addButton, { bubbles: true });
    });

    let addItemArea = document.querySelector("textarea")!;
    expect(addItemArea).not.toBeNull();

    await act(async () => {
      fireEvent.change(addItemArea, { target: { value: "second item" } });
    });

    addItemArea = document.querySelector("textarea")!;
    expect(addItemArea.value).toBe("second item");

    const saveMemberButton = getByText(container!, "Save");

    await act(async () => {
      fireEvent.click(saveMemberButton, { bubbles: true });
    });

    expect(mocks.ipcRenderer.send).toHaveBeenLastCalledWith(
      "addSetMember",
      "new:set",
      "second item"
    );

    const copyButton = getByTestId(preview, "item-copy");
    await act(async () => {
      fireEvent.click(copyButton, { bubbles: true });
      await waitFor(
        () =>
          expect(mocks.writeText).toBeCalledWith(
            JSON.stringify({ "new:set": ["first member"] })
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
            "new:set"
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
            "new:set"
          );
        },
        { timeout: 1200 }
      );
    });
  });
});
