import { act, fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";

import { store } from "../../redux/store";
import { Item, StringType } from "../../redux/Types/Item";
import services from "../../services/services";

import StringComponent from "./StringComponent";

import "@testing-library/jest-dom/extend-expect";

const ITEM: Item<StringType> = {
  key: "string:key",
  value: "the value",
  ttl: -1,
  type: "string",
};

describe("<Input />", () => {
  let sendSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.useFakeTimers();
    sendSpy = jest.spyOn(services, "send").mockImplementation(() => ({}));
  });

  it("Should render", () => {
    render(
      <Provider store={store}>
        <StringComponent item={ITEM} />
      </Provider>
    );

    const textArea = screen.getByTestId("string-textarea");
    const ttl = screen.getByTestId("string-ttl");
    const actions = screen.getByTestId("string-actions");

    expect(textArea).toBeInTheDocument();
    expect(ttl).toBeInTheDocument();
    expect(actions).toBeInTheDocument();
  });

  it("Should save document", async () => {
    render(
      <Provider store={store}>
        <StringComponent item={ITEM} />
      </Provider>
    );

    const textArea = screen.getByTestId("string-textarea");
    const save = screen.getByTestId("item-save");

    act(() => {
      fireEvent.change(textArea, { target: { value: "some other string" } });
      save.click();
      jest.runAllTimers();
    });

    expect(sendSpy).toHaveBeenCalledTimes(1);
    expect(sendSpy).toHaveBeenCalledWith(
      "alterString",
      "string:key",
      "some other string"
    );
  });
});
