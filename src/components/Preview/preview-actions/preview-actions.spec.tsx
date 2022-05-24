import { act, fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";

import "@testing-library/jest-dom/extend-expect";
import { Item } from "../../../redux/Types/Item";
import { store } from "../../../redux/store";
import services from "../../../services/services";

import { PreviewActions } from "./index";

const ITEM: Item = {
  value: {
    firstKey: "first element",
    secondKey: "second element",
  },
  key: "some:key",
  ttl: -1,
  type: "hash",
};

describe("<PreviewActions />", () => {
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
        <PreviewActions item={ITEM} onAddClick={() => ({})} />
      </Provider>
    );

    const add = screen.getByTestId("item-add");
    const copy = screen.getByTestId("item-copy");
    const ttl = screen.getByTestId("item-ttl");
    const remove = screen.getByTestId("item-remove");

    expect(add).toBeInTheDocument();
    expect(copy).toBeInTheDocument();
    expect(ttl).toBeInTheDocument();
    expect(remove).toBeInTheDocument();
  });

  it("Should copy as JSON", () => {
    render(
      <Provider store={store}>
        <PreviewActions item={ITEM} onAddClick={() => ({})} />
      </Provider>
    );

    const copy = screen.getByTestId("item-copy");

    act(() => {
      copy.click();
    });

    expect(navigator.clipboard.writeText).toHaveBeenCalledTimes(1);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      JSON.stringify({ [ITEM.key]: ITEM.value })
    );
  });

  it("Should edit TTL", () => {
    render(
      <Provider store={store}>
        <PreviewActions item={ITEM} onAddClick={() => ({})} />
      </Provider>
    );

    const editTTL = screen.getByTestId("item-ttl");

    act(() => {
      editTTL.click();
    });

    const ttl = store.getState().editTTL;
    expect(ttl).toEqual(ITEM);
  });

  it("Should remove key", async () => {
    render(
      <Provider store={store}>
        <PreviewActions item={ITEM} onAddClick={() => ({})} />
      </Provider>
    );

    const remove = screen.getByTestId("item-remove");

    await act(async () => {
      fireEvent.mouseDown(remove);
      await new Promise((res) => setTimeout(res, 1050));
      fireEvent.mouseUp(remove);
    });

    expect(sendSpy).toHaveBeenCalledTimes(1);
    expect(sendSpy).toHaveBeenCalledWith("deleteKey", ["some:key"]);
  });

  it("Should not remove key", async () => {
    render(
      <Provider store={store}>
        <PreviewActions item={ITEM} onAddClick={() => ({})} />
      </Provider>
    );

    const remove = screen.getByTestId("item-remove");

    await act(async () => {
      fireEvent.mouseDown(remove);
      await new Promise((res) => setTimeout(res, 580));
      fireEvent.mouseUp(remove);
    });

    expect(sendSpy).toHaveBeenCalledTimes(0);
  });

  it("Should open add property", async () => {
    const mock = jest.fn();
    render(
      <Provider store={store}>
        <PreviewActions item={ITEM} onAddClick={mock} />
      </Provider>
    );

    const add = screen.getByTestId("item-add");

    act(() => {
      add.click();
    });

    expect(mock).toHaveBeenCalledTimes(1);
  });
});
