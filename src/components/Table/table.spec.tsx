import { Provider } from "react-redux";
import { act, fireEvent, render, screen } from "@testing-library/react";

import { actions, store } from "../../redux/store";
import { ItemType } from "../../redux/Types/Item";
import services from "../../services/services";

import Table from "./index";

import "@testing-library/jest-dom/extend-expect";

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

describe("<Table />", () => {
  let sendSpy: jest.SpyInstance;

  beforeEach(() => {
    sendSpy = jest.spyOn(services, "send").mockImplementation(() => ({}));
  });

  it("Should render", () => {
    render(
      <Provider store={store}>
        <Table data={ITEMS} onItemEdit={() => ({})} />
      </Provider>
    );

    const sidebar = screen.getByTestId("database-table-container");
    const rows = screen.getAllByTestId("database-table-item");

    expect(sidebar).toBeInTheDocument();
    expect(rows.length).toEqual(5);
  });

  it("Should open preview", () => {
    const mock = jest.fn();

    render(
      <Provider store={store}>
        <Table data={ITEMS} onItemEdit={mock} />
      </Provider>
    );

    const item = screen.getAllByTestId("database-table-item-key")[3];

    act(() => {
      fireEvent.click(item);
    });

    expect(mock).toHaveBeenCalledTimes(1);
    expect(mock).toHaveBeenCalledWith(ITEMS[3]);
  });

  it("Should multiselect", () => {
    render(
      <Provider store={store}>
        <Table data={ITEMS} onItemEdit={() => ({})} />
      </Provider>
    );

    const rows = screen.getAllByTestId("database-table-item-checkbox");
    expect(rows.length).toEqual(5);

    act(() => {
      rows[1].click();
      rows[3].click();
      rows[4].click();
    });

    expect(store.getState().selected).toEqual([
      ITEMS[1].key,
      ITEMS[3].key,
      ITEMS[4].key,
    ]);
  });

  it("Should select all", () => {
    render(
      <Provider store={store}>
        <Table data={ITEMS} onItemEdit={() => ({})} />
      </Provider>
    );

    act(() => {
      store.dispatch(actions.setData(ITEMS));
      store.dispatch(actions.clearSelection());
    });

    const checkbox = screen.getByTestId("database-table-select-all");
    expect(store.getState().selected).toEqual([]);

    act(() => {
      checkbox.click();
    });

    expect(store.getState().selected).toEqual(ITEMS.map(({ key }) => key));
  });

  it("Should load more", () => {
    render(
      <Provider store={store}>
        <Table data={ITEMS} onItemEdit={() => ({})} />
      </Provider>
    );

    act(() => {
      store.dispatch(
        actions.setQuery({ done: false, cursor: 15, input: "*", count: 15 })
      );
    });

    const loadMore = screen.getByTestId("database-table-load-more");

    act(() => {
      loadMore.click();
    });

    expect(sendSpy).toHaveBeenCalledTimes(1);
    expect(sendSpy).toHaveBeenCalledWith("loadMore", "*", 15);
  });
});
