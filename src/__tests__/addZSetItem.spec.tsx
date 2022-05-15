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

  it("should open/edit zset item", async () => {
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
            key: "new:zset",
            type: "zset",
            value: [
              {
                value: "new zset member",
                score: "50",
              },
            ],
          },
        ])
      );

      store.dispatch(actions.setConnected(true));
    });

    const items = getAllByTestId(container!, "item-table-row");

    const zset = items.find((item) => !!getByText(item, "zset"))!;
    expect(zset).not.toBeNull();

    const button = getByTitle(zset, "Click to view");

    act(() => {
      fireEvent.click(button, { bubbles: true });
    });
    const preview = getByTestId(container!, "preview");

    expect(preview).not.toBeNull();
    expect(preview).toHaveStyleRule("width", "350px");
    expect(preview?.querySelector("h1")?.textContent).toBe("new:zset");
    expect(getByText(preview, "new zset member")).not.toBeNull();
    expect(getByText(preview, "50")).not.toBeNull();

    const firstItem = getByText(preview, "new zset member")?.parentElement;
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
    const editScore = preview.querySelector("input")!;

    expect(editValue).not.toBeNull();
    expect(editScore).not.toBeNull();

    act(() => {
      fireEvent.change(editValue, {
        target: { value: "some other zset member" },
      });
    });
    act(() => {
      fireEvent.change(editScore, { target: { value: "80" } });
    });

    expect(editValue.value).toBe("some other zset member");
    expect(editScore.value).toBe("80");

    const copyItemButton = getByTestId(container!, "message-copy")!;
    expect(copyItemButton).not.toBeNull();

    act(() => {
      fireEvent.click(copyItemButton, { bubbles: true });
    });

    expect(mocks.writeText).toHaveBeenLastCalledWith(
      JSON.stringify({ "80": "some other zset member" })
    );

    const saveItemButton = getByText(container!, "Save")!;
    expect(saveItemButton).not.toBeNull();

    act(() => {
      fireEvent.click(saveItemButton, { bubbles: true });
    });

    expect(mocks.ipcRenderer.send).toHaveBeenLastCalledWith(
      "addZSetMember",
      "new:zset",
      "some other zset member",
      "80"
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
      "removeZSetMember",
      "new:zset",
      "new zset member",
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

    let addItemValue = preview.querySelector("textarea")!;
    expect(addItemValue).not.toBeNull();

    let addItemScore = preview.querySelector("input")!;
    expect(addItemScore).not.toBeNull();

    act(() => {
      fireEvent.change(addItemValue, { target: { value: "new another item" } });
    });

    act(() => {
      fireEvent.change(addItemScore, { target: { value: "90" } });
    });

    addItemValue = preview.querySelector("textarea")!;
    expect(addItemValue.value).toBe("new another item");
    addItemScore = preview.querySelector("input")!;
    expect(addItemScore.value).toBe("90");

    const saveMemberButton = getByText(container!, "Save");

    await act(async () => {
      fireEvent.click(saveMemberButton, { bubbles: true });
    });

    expect(mocks.ipcRenderer.send).toHaveBeenLastCalledWith(
      "addZSetMember",
      "new:zset",
      "new another item",
      "90"
    );

    const copyButton = getByTestId(preview, "item-copy");
    await act(async () => {
      fireEvent.click(copyButton, { bubbles: true });
      await waitFor(
        () =>
          expect(mocks.writeText).toBeCalledWith(
            JSON.stringify({
              "new:zset": [{ value: "new zset member", score: "50" }],
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
            "new:zset"
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
            "new:zset"
          );
        },
        { timeout: 1200 }
      );
    });
  });
});
