import { act, fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";

import { store } from "../../redux/store";
import { Item, SetType } from "../../redux/Types/Item";
import services from "../../services/services";

import SetComponent from "./SetComponent";

import "@testing-library/jest-dom/extend-expect";

const ITEM: Item<SetType> = {
  value: ["first", "second", "third"],
  key: "set:key",
  ttl: -1,
  type: "set",
};

describe("<SetComponent />", () => {
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
        <SetComponent item={ITEM} />
      </Provider>
    );

    const preview = screen.getByTestId("set-preview");
    const ttl = screen.getByTestId("set-ttl");
    const actions = screen.getByTestId("set-actions");

    expect(preview).toBeInTheDocument();
    expect(ttl).toBeInTheDocument();
    expect(actions).toBeInTheDocument();
  });

  it("Should open add modal", () => {
    const { container } = render(
      <Provider store={store}>
        <SetComponent item={ITEM} />
      </Provider>
    );

    const add = screen.getByTestId("item-add");

    act(() => {
      add.click();
    });

    const title = screen.getByTestId("add-item-modal-title");
    expect(title).toBeInTheDocument();

    const close = screen.getByTestId("add-item-modal-close");

    act(() => {
      close.click();
    });

    expect(
      container.querySelector('[data-testid="add-item-modal-title"]')
    ).toBeNull();
  });
  it("Should add a member", () => {
    const { container } = render(
      <Provider store={store}>
        <SetComponent item={ITEM} />
      </Provider>
    );

    const add = screen.getByTestId("item-add");

    act(() => {
      add.click();
    });

    const textArea = container.querySelector("textarea");
    const save = screen.getByTestId("add-item-modal-save");

    expect(textArea).not.toBeNull();
    expect(save).toBeInTheDocument();

    act(() => {
      fireEvent.change(textArea!, { target: { value: "new member value" } });
      save.click();
    });

    expect(sendSpy).toHaveBeenCalledTimes(1);
    expect(sendSpy).toHaveBeenCalledWith(
      "alter",
      "set:key",
      ["new member value"],
      { oldValue: null }
    );
  });

  it("Should edit a member", () => {
    const { container } = render(
      <Provider store={store}>
        <SetComponent item={ITEM} />
      </Provider>
    );

    const items = container.querySelectorAll("tr");
    expect(items.length).toEqual(4);

    act(() => {
      items[1].click();
    });

    const textArea = container.querySelector("textarea");
    const save = screen.getByTestId("add-item-modal-save");

    expect(textArea).not.toBeNull();
    expect(save).toBeInTheDocument();

    act(() => {
      fireEvent.change(textArea!, {
        target: { value: "new other member value" },
      });
      save.click();
    });

    expect(sendSpy).toHaveBeenCalledTimes(1);
    expect(sendSpy).toHaveBeenCalledWith(
      "alter",
      "set:key",
      ["new other member value"],
      { oldValue: "first" }
    );
  });

  it("Should copy a member", () => {
    const { container } = render(
      <Provider store={store}>
        <SetComponent item={ITEM} />
      </Provider>
    );

    const items = container.querySelectorAll("tr");
    expect(items.length).toEqual(4);

    act(() => {
      items[2].click();
    });

    const copy = screen.getByTestId("add-item-modal-copy");

    act(() => {
      copy.click();
    });

    expect(navigator.clipboard.writeText).toHaveBeenCalledTimes(1);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      JSON.stringify(["second"])
    );
  });

  it("Should remove a member", () => {
    const { container } = render(
      <Provider store={store}>
        <SetComponent item={ITEM} />
      </Provider>
    );

    const items = container.querySelectorAll("tr");
    expect(items.length).toEqual(4);

    act(() => {
      items[3].click();
    });

    const remove = screen.getByTestId("add-item-modal-remove");

    act(() => {
      remove.click();
    });

    expect(sendSpy).toHaveBeenCalledTimes(1);
    expect(sendSpy).toHaveBeenCalledWith("del", "set:key", "third");
  });
});
