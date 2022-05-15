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
} from "@testing-library/react";
import { actions, store } from "../redux/store";
import mocks from "../utils/WindowRequireMock";

describe("<Home />", () => {
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

  it("should connect", (done) => {
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
        actions.currentConnection({
          host: "host",
          id: "id",
          password: "password",
          tls: false,
          name: "name",
          port: "1234",
        })
      );
    });

    act(() => {
      store.dispatch(actions.setConnected(true));
    });
    expect(getByText(container!, "Search:")).not.toBeNull();
    done();
  });

  it("should have items", (done) => {
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
            ttl: 15000,
          },
          {
            key: "new:hash",
            type: "hash",
            value: {
              "New Key": "New Value",
            },
            ttl: 15000,
          },
          {
            key: "new:set",
            type: "set",
            value: ["New Set Member"],
            ttl: 15000,
          },
          {
            key: "new:list",
            type: "list",
            value: ["New List Member"],
            ttl: 15000,
          },
          {
            key: "new:zset",
            type: "zset",
            value: [{ value: "New ZSet Member", score: "50" }],
            ttl: 15000,
          },
        ])
      );

      store.dispatch(actions.setConnected(true));
    });

    expect(getByText(container!, "string")).not.toBeNull();
    expect(getByText(container!, "set")).not.toBeNull();
    expect(getByText(container!, "zset")).not.toBeNull();
    expect(getByText(container!, "hash")).not.toBeNull();
    expect(getByText(container!, "list")).not.toBeNull();

    done();
  });

  it("should add one item", (done) => {
    act(() => {
      ReactDOM.render(
        <ThemeWrapper>
          <App />
        </ThemeWrapper>,
        container
      );
    });

    const toolbar = getByTestId(container!, "toolbar");
    expect(toolbar).not.toBeNull();

    const addButton = getByTestId(container!, "data-add");
    expect(addButton).not.toBeNull();

    act(() => {
      fireEvent.click(addButton, { bubbles: true });
    });

    let addMessage = getByTestId(container!, "data-add-message");
    expect(addMessage).not.toBeNull();

    const cancelButton = getByText(addMessage, "Cancel");

    act(() => {
      fireEvent.click(cancelButton, { bubbles: true });
    });

    expect(
      container?.querySelector('[data-testid="data-add-message"]')
    ).toBeNull();

    act(() => {
      fireEvent.click(getByTestId(container!, "data-add"), { bubbles: true });
    });

    addMessage = getByTestId(container!, "data-add-message");
    expect(addMessage).not.toBeNull();

    const selectType = addMessage.querySelector("select")!;
    expect(selectType).not.toBeNull();

    act(() => {
      fireEvent.change(selectType, { target: { value: "string" } });
    });

    expect(selectType.value).toBe("string");

    const inputName = addMessage.querySelector("input")!;

    act(() => {
      fireEvent.change(inputName, { target: { value: "another:string" } });
    });

    expect(inputName.value).toBe("another:string");

    const saveButton = addMessage.querySelector('button[data-testid="teste1"]');
    expect(saveButton).not.toBeNull();

    act(() => {
      fireEvent.click(saveButton!, { bubbles: true });
    });

    expect(mocks.ipcRenderer.send).toHaveBeenLastCalledWith(
      "addKey",
      "another:string",
      "string"
    );

    done();
  });

  it("should remove one item with multiple selection", (done) => {
    act(() => {
      ReactDOM.render(
        <ThemeWrapper>
          <App />
        </ThemeWrapper>,
        container
      );
    });

    const item = getAllByTestId(container!, "item-table-row");
    expect(item).not.toBeNull();

    const firstItem = item[0];
    const secondItem = item[1];
    const thirdItem = item[2];

    const checkbox = getByTestId(firstItem!, "checkbox-input");
    expect(checkbox).not.toBeNull();

    let removeButton = getByTestId(container!, "data-remove");
    expect(removeButton).not.toBeNull();
    expect((removeButton as HTMLButtonElement).disabled).toBe(true);

    act(() => {
      fireEvent.click(checkbox!, { bubbles: true });
    });

    let selected = store.getState().selected;

    expect(
      !!selected.find(
        (el) => el === firstItem!.querySelector("span")!.textContent
      )
    ).toBe(true);

    removeButton = getByTestId(container!, "data-remove");
    expect((removeButton as HTMLButtonElement).disabled).toBe(false);

    act(() => {
      fireEvent.click(removeButton, { bubbles: true });
    });

    let confirmationMessage = getByTestId(container!, "confirmation-message");
    expect(confirmationMessage).not.toBeNull();

    expect(getByText(confirmationMessage, "Attention")).not.toBeNull();
    expect(
      getByText(confirmationMessage, /Do you really want to delete/gi)
    ).not.toBeNull();

    const cancel = getByText(container!, /Cancel/gi).parentElement!;
    expect(cancel).not.toBeNull();

    act(() => {
      fireEvent.click(cancel, { bubbles: true });
    });

    expect(store.getState().confirmation).toBeUndefined();

    removeButton = getByTestId(container!, "data-remove");
    act(() => {
      fireEvent.click(removeButton, { bubbles: true });
    });

    confirmationMessage = getByTestId(container!, "confirmation-message");
    let confirm = getByText(confirmationMessage, /Confirm/gi).parentElement!;
    expect(confirm).not.toBeNull();

    act(() => {
      fireEvent.click(confirm, { bubbles: true });
    });

    expect(mocks.ipcRenderer.send).toHaveBeenLastCalledWith("deleteKey", [
      firstItem!.querySelector("span")!.textContent,
    ]);
    expect(store.getState().favorites.length).toBe(0);

    const secondCheckbox = getByTestId(secondItem!, "checkbox-input");
    expect(secondCheckbox).not.toBeNull();

    const thirdCheckbox = getByTestId(thirdItem!, "checkbox-input");
    expect(thirdCheckbox).not.toBeNull();

    act(() => {
      fireEvent.click(secondCheckbox!, { bubbles: true });
    });

    act(() => {
      fireEvent.click(thirdCheckbox!, { bubbles: true });
    });

    removeButton = getByTestId(container!, "data-remove");
    expect(removeButton).not.toBeNull();

    act(() => {
      fireEvent.click(removeButton, { bubbles: true });
    });

    confirmationMessage = getByTestId(container!, "confirmation-message");
    confirm = getByText(confirmationMessage, /Confirm/gi).parentElement!;
    expect(confirm).not.toBeNull();

    act(() => {
      fireEvent.click(confirm, { bubbles: true });
    });

    expect(mocks.ipcRenderer.send).toHaveBeenLastCalledWith("deleteKey", [
      secondItem!.querySelector("span")!.textContent,
      thirdItem!.querySelector("span")!.textContent,
    ]);
    expect(store.getState().favorites.length).toBe(0);

    done();
  });

  it("should select/deselect all", (done) => {
    act(() => {
      ReactDOM.render(
        <ThemeWrapper>
          <App />
        </ThemeWrapper>,
        container
      );
    });

    let tableHeader = getByTestId(container!, "home-table-header");
    expect(tableHeader).not.toBeNull();

    let checkbox = getByTestId(tableHeader, "checkbox-input");
    expect(checkbox).not.toBeNull();

    act(() => {
      fireEvent.click(checkbox, { bubbles: true });
    });

    const { data, selected } = store.getState();

    expect(selected.length).toBeGreaterThan(0);
    expect(data.length).toBe(selected.length);

    tableHeader = getByTestId(container!, "home-table-header");
    checkbox = getByTestId(tableHeader, "checkbox-input");

    act(() => {
      fireEvent.click(checkbox, { bubbles: true });
    });

    expect(store.getState().selected.length).toBe(0);

    done();
  });

  it("should one or more export items", (done) => {
    act(() => {
      ReactDOM.render(
        <ThemeWrapper>
          <App />
        </ThemeWrapper>,
        container
      );
    });

    act(() => {
      store.dispatch(actions.clearSelection());
    });

    const downloadButton = getByTestId(container!, "data-export");
    expect(downloadButton).not.toBeNull();

    const item = getAllByTestId(container!, "item-table-row");
    expect(item.length).toBe(5);

    const firstItem = getByTestId(item[0]!, "checkbox-input");
    const secondItem = getByTestId(item[1]!, "checkbox-input");
    const thirdItem = getByTestId(item[2]!, "checkbox-input");

    act(() => {
      fireEvent.click(firstItem, { bubbles: true });
    });
    act(() => {
      fireEvent.click(secondItem, { bubbles: true });
    });
    act(() => {
      fireEvent.click(thirdItem, { bubbles: true });
    });

    expect(store.getState().selected.length).toBe(3);

    act(() => {
      fireEvent.click(downloadButton, { bubbles: true });
    });

    expect(mocks.createObjectURL).toBeCalledTimes(1);

    done();
  });

  it("should refresh", (done) => {
    act(() => {
      ReactDOM.render(
        <ThemeWrapper>
          <App />
        </ThemeWrapper>,
        container
      );
    });

    const refreshButton = getByTestId(container!, "data-refresh");
    expect(refreshButton).not.toBeNull();

    act(() => {
      fireEvent.click(refreshButton, { bubbles: true });
    });

    expect(mocks.ipcRenderer.send).toHaveBeenLastCalledWith("update", "");
    done();
  });

  it("should search for an item on enter", (done) => {
    act(() => {
      ReactDOM.render(
        <ThemeWrapper>
          <App />
        </ThemeWrapper>,
        container
      );
    });

    let searchBar = container?.querySelector("input");
    expect(searchBar).not.toBeNull();

    act(() => {
      fireEvent.change(searchBar!, { target: { value: "*new*" } });
    });

    searchBar = container?.querySelector("input");
    expect(searchBar?.value).toBe("*new*");

    act(() => {
      fireEvent.keyDown(searchBar!, { key: "Enter", keyCode: "Enter" });
    });

    expect(mocks.ipcRenderer.send).toHaveBeenLastCalledWith("find", "*new*");
    done();
  });

  it("should search for an item on click", (done) => {
    act(() => {
      ReactDOM.render(
        <ThemeWrapper>
          <App />
        </ThemeWrapper>,
        container
      );
    });

    let searchBar = container?.querySelector("input");
    expect(searchBar).not.toBeNull();

    act(() => {
      fireEvent.change(searchBar!, { target: { value: "string*" } });
    });

    searchBar = container?.querySelector("input");
    expect(searchBar?.value).toBe("string*");

    const searchButton = getByText(container!, "Apply");
    expect(searchButton).not.toBeNull();

    act(() => {
      fireEvent.click(searchButton.parentElement!, { bubbles: true });
    });

    expect(mocks.ipcRenderer.send).toHaveBeenLastCalledWith("find", "string*");
    done();
  });

  it("should switch database", (done) => {
    act(() => {
      ReactDOM.render(
        <ThemeWrapper>
          <App />
        </ThemeWrapper>,
        container
      );
    });

    let selectDatabase = container?.querySelector("select");
    expect(selectDatabase).not.toBeNull();
    expect(selectDatabase?.value).toBe("DB 0");

    act(() => {
      fireEvent.change(selectDatabase!, { target: { value: "DB 3" } });
    });

    selectDatabase = container?.querySelector("select");

    expect(selectDatabase!.value).toBe("DB 3");
    expect(mocks.ipcRenderer.send).toHaveBeenLastCalledWith(
      "selectDatabase",
      3
    );

    done();
  });

  it("should close preview on close button click", (done) => {
    act(() => {
      ReactDOM.render(
        <ThemeWrapper>
          <App />
        </ThemeWrapper>,
        container
      );
    });

    const item = getByText(container!, "new:string");
    expect(item).not.toBeNull();

    let preview = getByTestId(container!, "preview");
    expect(preview).not.toBeNull();
    expect(preview).toHaveStyleRule("width", "0");

    act(() => {
      fireEvent.click(item.parentElement!, { bubbles: true });
    });

    preview = getByTestId(container!, "preview");
    expect(preview).toHaveStyleRule("width", "350px");

    const closeButton = getByTestId(preview, "preview-close");
    expect(closeButton).not.toBeNull();

    act(() => {
      fireEvent.click(closeButton, { bubbles: true });
    });

    preview = getByTestId(container!, "preview");
    expect(preview).toHaveStyleRule("width", "0");

    done();
  });

  it("should close preview on select same item", (done) => {
    done();
  });

  it("should disconnect", (done) => {
    done();
  })

  it("should save favorite", (done) => {
    done();
  })
});
