import { act, fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";

import { store } from "../../redux/store";
import "@testing-library/jest-dom/extend-expect";
import { HashType, Item } from "../../redux/Types/Item";
import services from "../../services/services";

import HashComponent from "./HashComponent";

const ITEM: Item<HashType> = {
  value: {
    firstKey: "first element",
    secondKey: "second element",
  },
  key: "some:key",
  ttl: -1,
  type: "hash",
};

describe("<HashComponent />", () => {
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
        <HashComponent item={ITEM} />
      </Provider>
    );

    const preview = screen.getByTestId("hash-preview");
    const ttl = screen.getByTestId("hash-ttl");

    expect(preview).toBeInTheDocument();
    expect(ttl).toBeInTheDocument();
  });

  it("Should preview item", () => {
    render(
      <Provider store={store}>
        <HashComponent item={ITEM} />
      </Provider>
    );

    const preview = screen.getByTestId("hash-preview");
    const items = preview.querySelectorAll("tr");

    expect(items.length).toEqual(3);

    const headerData = items[0].querySelectorAll("th");

    expect(headerData.length).toEqual(2);
    expect(headerData[0]).toHaveTextContent("Key");
    expect(headerData[1]).toHaveTextContent("Value");

    const firstRowData = items[1].querySelectorAll("td");

    expect(firstRowData.length).toEqual(2);
    expect(firstRowData[0]).toHaveTextContent("firstKey");
    expect(firstRowData[1]).toHaveTextContent("first element");

    const secondRowData = items[2].querySelectorAll("td");

    expect(secondRowData.length).toEqual(2);
    expect(secondRowData[0]).toHaveTextContent("secondKey");
    expect(secondRowData[1]).toHaveTextContent("second element");
  });

  it("Should open add property", () => {
    render(
      <Provider store={store}>
        <HashComponent item={ITEM} />
      </Provider>
    );

    const add = screen.getByTestId("item-add");

    act(() => {
      add.click();
    });

    const addModal = screen.getByTestId("hash-add-modal");
    expect(addModal).toBeInTheDocument();
  });

  it("Should edit a property", () => {
    const { container } = render(
      <Provider store={store}>
        <HashComponent item={ITEM} />
      </Provider>
    );

    const preview = screen.getByTestId("hash-preview");
    const items = preview.querySelectorAll("tr");

    act(() => {
      fireEvent.click(items[1]);
    });

    const addModal = screen.getByTestId("hash-add-modal");
    const addTitle = container.querySelector('[data-testid="add-modal-title"]');

    expect(addModal).toBeInTheDocument();
    expect(addTitle).toBeInTheDocument();
  });

  it("Should close the modal ", () => {
    const { container } = render(
      <Provider store={store}>
        <HashComponent item={ITEM} />
      </Provider>
    );

    const preview = screen.getByTestId("hash-preview");
    const items = preview.querySelectorAll("tr");

    act(() => {
      fireEvent.click(items[1]);
    });

    act(() => {
      fireEvent.click(screen.getByTestId("add-modal-close"));
    });

    const addTitle = container.querySelector('[data-testid="add-modal-title"]');
    expect(addTitle).toBeNull();
  });

  it("Should change a property ", () => {
    const { container } = render(
      <Provider store={store}>
        <HashComponent item={ITEM} />
      </Provider>
    );

    const preview = screen.getByTestId("hash-preview");
    const items = preview.querySelectorAll("tr");

    act(() => {
      fireEvent.click(items[1]);
    });

    const input = container.querySelector("input");
    const textArea = container.querySelector("textarea");
    const save = screen.getByTestId("add-modal-save");

    expect(input).not.toBeNull();
    expect(textArea).not.toBeNull();
    expect(input).toBeDisabled();
    expect(save).toBeInTheDocument();

    act(() => {
      fireEvent.change(textArea!, { target: { value: "new prop value" } });
      save.click();
    });

    const addTitle = container.querySelector('[data-testid="add-modal-title"]');

    expect(addTitle).toBeNull();
    expect(sendSpy).toHaveBeenCalledTimes(1);
    expect(sendSpy).toHaveBeenCalledWith(
      "alter",
      "some:key",
      {
        firstKey: "new prop value",
      },
      undefined
    );
  });

  it("Should create a property ", () => {
    const { container } = render(
      <Provider store={store}>
        <HashComponent item={ITEM} />
      </Provider>
    );

    const addButton = screen.getByTestId("item-add");

    act(() => {
      fireEvent.click(addButton);
    });

    const input = container.querySelector("input");
    const textArea = container.querySelector("textarea");
    const save = screen.getByTestId("add-modal-save");

    expect(input).not.toBeNull();
    expect(textArea).not.toBeNull();
    expect(input).not.toBeDisabled();
    expect(save).toBeInTheDocument();

    act(() => {
      fireEvent.change(input!, { target: { value: "new:prop:key" } });
      fireEvent.change(textArea!, { target: { value: "new prop value" } });
      save.click();
    });

    const addTitle = container.querySelector('[data-testid="add-modal-title"]');

    expect(addTitle).toBeNull();
    expect(sendSpy).toHaveBeenCalledTimes(1);
    expect(sendSpy).toHaveBeenCalledWith(
      "alter",
      "some:key",
      {
        "new:prop:key": "new prop value",
      },
      undefined
    );
  });

  it("Should remove a property ", () => {
    const { container } = render(
      <Provider store={store}>
        <HashComponent item={ITEM} />
      </Provider>
    );

    const preview = screen.getByTestId("hash-preview");
    const items = preview.querySelectorAll("tr");

    act(() => {
      fireEvent.click(items[1]);
    });

    const input = container.querySelector("input");
    const textArea = container.querySelector("textarea");
    const remove = screen.getByTestId("add-modal-remove");

    expect(input).not.toBeNull();
    expect(textArea).not.toBeNull();
    expect(remove).toBeInTheDocument();

    act(() => {
      remove.click();
    });

    const addTitle = container.querySelector('[data-testid="add-modal-title"]');

    expect(addTitle).toBeNull();
    expect(sendSpy).toHaveBeenCalledTimes(1);
    expect(sendSpy).toHaveBeenCalledWith("del", "some:key", "firstKey");
  });

  it("Should copy a property ", () => {
    const { container } = render(
      <Provider store={store}>
        <HashComponent item={ITEM} />
      </Provider>
    );

    const preview = screen.getByTestId("hash-preview");
    const items = preview.querySelectorAll("tr");

    act(() => {
      fireEvent.click(items[1]);
    });

    const copy = screen.getByTestId("add-modal-copy");
    expect(copy).toBeInTheDocument();

    act(() => {
      copy.click();
    });

    const addTitle = container.querySelector('[data-testid="add-modal-title"]');

    expect(addTitle).not.toBeNull();
    expect(navigator.clipboard.writeText).toHaveBeenCalledTimes(1);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      JSON.stringify({ firstKey: "first element" })
    );
  });
});
