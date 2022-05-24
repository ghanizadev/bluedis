import { act, fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";

import { store } from "../../redux/store";
import { Item } from "../../redux/Types/Item";

import ListComponent from "./ListComponent";

import "@testing-library/jest-dom/extend-expect";
import services from "../../services/services";

const ITEM: Item = {
  key: "list:key",
  value: ["first", "second", "third"],
  ttl: -1,
  type: "list",
};

describe("<ListComponent />", () => {
  let sendSpy: jest.SpyInstance;

  beforeAll(() => {
    Object.defineProperty(navigator, "clipboard", {
      value: {
        writeText: jest.fn(),
      },
    });
  });

  beforeEach(() => {
    navigator.clipboard.writeText = jest.fn();
    sendSpy = jest.spyOn(services, "send").mockImplementation(() => ({}));
  });

  it("Should render", () => {
    render(
      <Provider store={store}>
        <ListComponent item={ITEM} />
      </Provider>
    );

    const preview = screen.getByTestId("list-preview");
    const actions = screen.getByTestId("list-actions");

    expect(preview).toBeInTheDocument();
    expect(actions).toBeInTheDocument();
  });

  it("Should open add property", () => {
    const { container } = render(
      <Provider store={store}>
        <ListComponent item={ITEM} />
      </Provider>
    );

    const add = screen.getByTestId("item-add");

    act(() => {
      add.click();
    });

    const modal = screen.getByTestId("add-item-modal");
    expect(modal).toBeInTheDocument();

    const textArea = container.querySelector("textarea");
    const save = screen.getByTestId("add-item-modal-save");

    expect(textArea).not.toBeNull();
    expect(save).toBeInTheDocument();

    act(() => {
      fireEvent.change(textArea!, { target: { value: "new other value" } });
      save.click();
    });

    const title = container.querySelector('[data-testid="add-modal-title"]');
    expect(title).toBeNull();
    expect(sendSpy).toHaveBeenCalledTimes(1);
    expect(sendSpy).toHaveBeenCalledWith(
      "addListMember",
      "list:key",
      "new other value"
    );
  });

  it("Should edit a property", () => {
    const { container } = render(
      <Provider store={store}>
        <ListComponent item={ITEM} />
      </Provider>
    );

    const items = container.querySelectorAll("tr");
    expect(items.length).toEqual(4);

    act(() => {
      items[1].click();
    });

    const modal = screen.getByTestId("add-item-modal");
    expect(modal).toBeInTheDocument();

    const textArea = container.querySelector("textarea");
    const save = screen.getByTestId("add-item-modal-save");

    expect(textArea).not.toBeNull();
    expect(save).toBeInTheDocument();

    act(() => {
      fireEvent.change(textArea!, { target: { value: "new value" } });
      save.click();
    });

    const title = container.querySelector('[data-testid="add-modal-title"]');
    expect(title).toBeNull();
    expect(sendSpy).toHaveBeenCalledTimes(1);
    expect(sendSpy).toHaveBeenCalledWith(
      "alterListMember",
      "list:key",
      "new value",
      0
    );
  });

  it("Should remove a property", () => {
    const { container } = render(
      <Provider store={store}>
        <ListComponent item={ITEM} />
      </Provider>
    );

    const items = container.querySelectorAll("tr");
    expect(items.length).toEqual(4);

    act(() => {
      items[1].click();
    });

    const modal = screen.getByTestId("add-item-modal");
    expect(modal).toBeInTheDocument();

    const remove = screen.getByTestId("add-item-modal-remove");

    act(() => {
      remove.click();
    });

    const title = container.querySelector('[data-testid="add-modal-title"]');
    expect(title).toBeNull();
    expect(sendSpy).toHaveBeenCalledTimes(1);
    expect(sendSpy).toHaveBeenCalledWith("removeListMember", "list:key", 0);
  });

  it("Should copy list item", () => {
    const { container } = render(
      <Provider store={store}>
        <ListComponent item={ITEM} />
      </Provider>
    );

    const items = container.querySelectorAll("tr");
    expect(items.length).toEqual(4);

    act(() => {
      items[1].click();
    });

    const modal = screen.getByTestId("add-item-modal");
    expect(modal).toBeInTheDocument();

    const copy = screen.getByTestId("add-item-modal-copy");

    act(() => {
      copy.click();
    });

    const title = container.querySelector('[data-testid="add-modal-title"]');
    expect(title).toBeNull();
    expect(navigator.clipboard.writeText).toHaveBeenCalledTimes(1);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      JSON.stringify({ 0: "first" })
    );
  });

  it("Should close modal", () => {
    const { container } = render(
      <Provider store={store}>
        <ListComponent item={ITEM} />
      </Provider>
    );

    const items = container.querySelectorAll("tr");
    expect(items.length).toEqual(4);

    act(() => {
      items[1].click();
    });

    const modal = screen.getByTestId("add-item-modal");
    expect(modal).toBeInTheDocument();

    const close = screen.getByTestId("add-item-modal-close");

    act(() => {
      close.click();
    });

    const title = container.querySelector('[data-testid="add-modal-title"]');
    expect(title).toBeNull();
  });
});
