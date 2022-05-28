import { act, fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";

import { store } from "../../redux/store";
import { Item, ZSetType } from "../../redux/Types/Item";
import services from "../../services/services";

import ZSetComponent from "./ZSetComponent";

import "@testing-library/jest-dom/extend-expect";

const ITEM: Item<ZSetType> = {
  value: [
    { value: "first", score: "0" },
    { value: "second", score: "50" },
    { value: "third", score: "500" },
  ],
  key: "zset:key",
  ttl: -1,
  type: "zset",
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
        <ZSetComponent item={ITEM} />
      </Provider>
    );

    const preview = screen.getByTestId("zset-preview");
    const ttl = screen.getByTestId("zset-ttl");
    const actions = screen.getByTestId("zset-actions");

    expect(preview).toBeInTheDocument();
    expect(ttl).toBeInTheDocument();
    expect(actions).toBeInTheDocument();
  });

  it("Should open add modal", () => {
    const { container } = render(
      <Provider store={store}>
        <ZSetComponent item={ITEM} />
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
        <ZSetComponent item={ITEM} />
      </Provider>
    );

    const add = screen.getByTestId("item-add");

    act(() => {
      add.click();
    });

    const textArea = container.querySelector("textarea");
    const input = container.querySelector("input");
    const save = screen.getByTestId("add-item-modal-save");

    expect(textArea).not.toBeNull();
    expect(input).not.toBeNull();
    expect(save).toBeInTheDocument();

    act(() => {
      fireEvent.change(textArea!, { target: { value: "new member value" } });
      fireEvent.change(input!, { target: { value: "75" } });
      save.click();
    });

    expect(sendSpy).toHaveBeenCalledTimes(1);
    expect(sendSpy).toHaveBeenCalledWith(
      "alter",
      "zset:key",
      [{ value: "new member value", score: "75" }],
      { oldValue: "" }
    );
  });

  it("Should edit a member", () => {
    const { container } = render(
      <Provider store={store}>
        <ZSetComponent item={ITEM} />
      </Provider>
    );

    const items = container.querySelectorAll("tr");
    expect(items.length).toEqual(4);

    act(() => {
      items[1].click();
    });

    const textArea = container.querySelector("textarea");
    const input = container.querySelector("input");
    const save = screen.getByTestId("add-item-modal-save");

    expect(textArea).not.toBeNull();
    expect(input).not.toBeNull();
    expect(save).toBeInTheDocument();

    act(() => {
      fireEvent.change(textArea!, {
        target: { value: "new other member value" },
      });
      fireEvent.change(input!, {
        target: { value: "15" },
      });
      save.click();
    });

    expect(sendSpy).toHaveBeenCalledTimes(1);
    expect(sendSpy).toHaveBeenCalledWith(
      "alter",
      "zset:key",
      [{ score: "15", value: "new other member value" }],
      { oldValue: "first" }
    );
  });

  it("Should copy a member", () => {
    const { container } = render(
      <Provider store={store}>
        <ZSetComponent item={ITEM} />
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
      JSON.stringify({ "50": "second" })
    );
  });

  it("Should remove a member", () => {
    const { container } = render(
      <Provider store={store}>
        <ZSetComponent item={ITEM} />
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
    expect(sendSpy).toHaveBeenCalledWith("del", "zset:key", "third");
  });
});
