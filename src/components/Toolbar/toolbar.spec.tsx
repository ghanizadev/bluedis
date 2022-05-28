import { Provider } from "react-redux";
import { act, fireEvent, render, screen } from "@testing-library/react";

import { actions, store } from "../../redux/store";
import { ItemType } from "../../redux/Types/Item";
import services from "../../services/services";

import Toolbar from "./index";

import "@testing-library/jest-dom/extend-expect";
import { Connection } from "../../redux/Types/Connection";

const ITEMS: ItemType[] = [
  {
    key: "new:set",
    ttl: 1,
    type: "set",
    value: ["some set value"],
  },
  {
    key: "new:zset",
    ttl: 2,
    type: "zset",
    value: { score: "10", value: "some zset value" },
  },
  {
    key: "new:string",
    ttl: 3,
    type: "string",
    value: "some string value",
  },
  {
    key: "new:list",
    ttl: 4,
    type: "list",
    value: ["some list value"],
  },
  {
    key: "new:hash",
    ttl: 4,
    type: "hash",
    value: { "some:key": "some hash value" },
  },
];

describe("<Toolbar />", () => {
  let sendSpy: jest.SpyInstance;

  beforeEach(() => {
    sendSpy = jest.spyOn(services, "send").mockImplementation(() => ({}));
  });

  it("Should render", () => {
    render(
      <Provider store={store}>
        <Toolbar onRefresh={() => ({})} onAddKey={() => ({})} />
      </Provider>
    );

    const toolbar = screen.getByTestId("toolbar");
    const addBtn = screen.getByTestId("data-add");
    const refreshBtn = screen.getByTestId("data-refresh");
    const removeBtn = screen.getByTestId("data-remove");
    const exportBtn = screen.getByTestId("data-export");
    const shellBtn = screen.getByTestId("data-shell");
    const disconnectBtn = screen.getByTestId("data-disconnect");
    const favoriteBtn = screen.getByTestId("data-favorite");

    expect(toolbar).toBeInTheDocument();
    expect(addBtn).toBeInTheDocument();
    expect(refreshBtn).toBeInTheDocument();
    expect(removeBtn).toBeInTheDocument();
    expect(exportBtn).toBeInTheDocument();
    expect(shellBtn).toBeInTheDocument();
    expect(disconnectBtn).toBeInTheDocument();
    expect(favoriteBtn).toBeInTheDocument();
  });

  it("Should refresh", () => {
    const mock = jest.fn();
    render(
      <Provider store={store}>
        <Toolbar onRefresh={mock} onAddKey={() => ({})} />
      </Provider>
    );

    const refreshBtn = screen.getByTestId("data-refresh");

    act(() => {
      refreshBtn.click();
    });

    expect(mock).toHaveBeenCalledTimes(1);
  });

  it("Should add key", () => {
    const mock = jest.fn();
    render(
      <Provider store={store}>
        <Toolbar onRefresh={() => ({})} onAddKey={mock} />
      </Provider>
    );

    const addBtn = screen.getByTestId("data-add");

    act(() => {
      addBtn.click();
    });

    expect(mock).toHaveBeenCalledTimes(1);
  });

  it("Should download selected", () => {
    render(
      <Provider store={store}>
        <Toolbar onRefresh={() => ({})} onAddKey={() => ({})} />
      </Provider>
    );

    act(() => {
      store.dispatch(actions.clearSelection());
      store.dispatch(actions.setData(ITEMS));
      store.dispatch(actions.pushSelected("new:list"));
    });

    const exportBtn = screen.getByTestId("data-export");

    act(() => {
      exportBtn.click();
    });

    expect(sendSpy).toHaveBeenCalledTimes(1);
    expect(sendSpy).toHaveBeenCalledWith("exportItems", ["new:list"]);
  });

  it("Should delete selected", () => {
    const actionSpy = jest
      .spyOn(actions, "setConfirmation")
      .mockImplementation((payload) => ({
        payload,
        type: "store/setConfirmation",
      }));

    render(
      <Provider store={store}>
        <Toolbar onRefresh={() => ({})} onAddKey={() => ({})} />
      </Provider>
    );

    act(() => {
      store.dispatch(actions.clearSelection());
      store.dispatch(actions.setData(ITEMS));
      store.dispatch(actions.pushSelected("new:string"));
    });

    const removeBtn = screen.getByTestId("data-remove");

    act(() => {
      removeBtn.click();
    });

    expect(actionSpy).toHaveBeenCalledTimes(1);
    const [payload] = actionSpy.mock.calls[0]!;

    act(() => {
      payload && payload.onConfirm();
    });

    expect(sendSpy).toHaveBeenCalledTimes(1);
    expect(sendSpy).toHaveBeenCalledWith("remove", ["new:string"]);
    expect(store.getState().selected).toEqual([]);

    actionSpy.mockClear();
  });

  it("Should disconnect", () => {
    render(
      <Provider store={store}>
        <Toolbar onRefresh={() => ({})} onAddKey={() => ({})} />
      </Provider>
    );

    const disconnectBtn = screen.getByTestId("data-disconnect");

    act(() => {
      disconnectBtn.click();
    });

    expect(sendSpy).toHaveBeenCalledTimes(1);
    expect(sendSpy).toHaveBeenCalledWith("disconnect");
  });

  it("Should open/close shell", () => {
    render(
      <Provider store={store}>
        <Toolbar onRefresh={() => ({})} onAddKey={() => ({})} />
      </Provider>
    );

    const shellBtn = screen.getByTestId("data-shell");
    expect(store.getState().terminal.open).toEqual(false);

    act(() => {
      shellBtn.click();
    });

    expect(store.getState().terminal.open).toEqual(true);

    act(() => {
      shellBtn.click();
    });

    expect(store.getState().terminal.open).toEqual(false);
  });

  it("Should add favorite", () => {
    const { container } = render(
      <Provider store={store}>
        <Toolbar onRefresh={() => ({})} onAddKey={() => ({})} />
      </Provider>
    );

    const CONN: Connection = {
      id: "1",
      tls: false,
      host: "localhost",
      port: "6379",
    };

    act(() => {
      store.dispatch(actions.currentConnection(CONN));
    });

    const favoriteBtn = screen.getByTestId("data-favorite");

    act(() => {
      favoriteBtn.click();
    });

    expect(screen.getByTestId("pick-container")).toBeInTheDocument();
    const cancel = screen.getByTestId("pick-cancel");

    act(() => {
      cancel.click();
    });

    expect(
      container.querySelector('[data-testid="pick-container"]')
    ).toBeNull();

    act(() => {
      favoriteBtn.click();
    });

    expect(screen.getByTestId("pick-container")).toBeInTheDocument();
    const input = screen.getByTestId("pick-input");
    const confirm = screen.getByTestId("pick-confirm");

    act(() => {
      fireEvent.change(input, { target: { value: "my favorite" } });
      confirm.click();
    });

    expect(store.getState().favorites[0]).toEqual({
      ...CONN,
      name: "my favorite",
    });
  });

  it("Should not add favorite when it was previously added", () => {
    const { container } = render(
      <Provider store={store}>
        <Toolbar onRefresh={() => ({})} onAddKey={() => ({})} />
      </Provider>
    );

    const CONN: Connection = {
      id: "1",
      tls: false,
      host: "localhost",
      port: "6379",
      name: "my favorite",
    };

    act(() => {
      store.dispatch(actions.updateFavorites([]));
      store.dispatch(actions.currentConnection(CONN));
      store.dispatch(actions.addFavorite(CONN));
    });

    expect(store.getState().favorites[0]).toEqual(CONN);
    expect(container.querySelector('[data-testid="data-favorite"]')).toBeNull();
  });
});
