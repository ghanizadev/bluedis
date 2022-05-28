import React from "react";
import { Provider } from "react-redux";
import { act, fireEvent, render, screen } from "@testing-library/react";

import { store } from "../../redux/store";

import AddKey from "./index";

import "@testing-library/jest-dom/extend-expect";

describe("<AddKey />", () => {
  it("Should render", () => {
    render(
      <Provider store={store}>
        <AddKey onConfirm={jest.fn()} onCancel={jest.fn()} />
      </Provider>
    );

    const component = screen.getByTestId("add-key-component");
    const confirmButton = screen.getByTestId("add-key-confirm");
    const cancelButton = screen.getByTestId("add-key-cancel");
    const nameInput = screen.getByTestId("add-key-name");

    expect(component).toBeInTheDocument();
    expect(confirmButton).toBeInTheDocument();
    expect(cancelButton).toBeInTheDocument();
    expect(nameInput).toBeInTheDocument();

    expect(confirmButton).toHaveTextContent("Confirm");
    expect(cancelButton).toHaveTextContent("Cancel");
  });

  it("Should not confirm", () => {
    const mock = jest.fn();

    render(
      <Provider store={store}>
        <AddKey onConfirm={mock} onCancel={mock} />
      </Provider>
    );

    const confirmButton = screen.getByTestId("add-key-confirm");

    confirmButton.click();
    expect(mock).toBeCalledTimes(0);
  });

  it("Should cancel", () => {
    const mock = jest.fn();

    render(
      <Provider store={store}>
        <AddKey onConfirm={mock} onCancel={mock} />
      </Provider>
    );

    const cancelButton = screen.getByTestId("add-key-cancel");

    cancelButton.click();
    expect(mock).toBeCalledTimes(1);
  });

  it("Should add a key", () => {
    const mock = jest.fn();

    render(
      <Provider store={store}>
        <AddKey onConfirm={mock} onCancel={mock} />
      </Provider>
    );

    const nameInput = screen.getByTestId("add-key-name");
    const confirmButton = screen.getByTestId("add-key-confirm");

    fireEvent.change(nameInput, { target: { value: "some:key" } });
    confirmButton.click();

    expect(mock).toBeCalledTimes(1);
    expect(mock).toBeCalledWith("set", "some:key", -1, false);
  });

  it("Should add a string key", () => {
    const mock = jest.fn();

    render(
      <Provider store={store}>
        <AddKey onConfirm={mock} onCancel={mock} />
      </Provider>
    );

    const nameInput = screen.getByTestId("add-key-name");
    const selectInput = screen.getByTestId("add-key-select");
    const confirmButton = screen.getByTestId("add-key-confirm");

    act(() => {
      selectInput.click();
      fireEvent.change(nameInput, { target: { value: "some:other:key" } });
      fireEvent.change(selectInput, { target: { value: "string" } });

      confirmButton.click();
    });

    expect(mock).toBeCalledTimes(1);
    expect(mock).toBeCalledWith("string", "some:other:key", -1, false);
  });

  it("Should add a key with TTL", () => {
    const mock = jest.fn();

    render(
      <Provider store={store}>
        <AddKey onConfirm={mock} onCancel={mock} />
      </Provider>
    );

    const nameInput = screen.getByTestId("add-key-name");
    const selectInput = screen.getByTestId("add-key-select");
    const ttlToggle = screen.getByTestId("add-key-toggle");
    const confirmButton = screen.getByTestId("add-key-confirm");

    act(() => {
      selectInput.click();
      ttlToggle.click();

      fireEvent.change(nameInput, { target: { value: "some:ttl:key" } });
      fireEvent.change(selectInput, { target: { value: "hash" } });

      const ttlInput = screen.getByTestId("add-key-ttl");
      fireEvent.change(ttlInput, { target: { value: "15" } });

      confirmButton.click();
    });

    expect(mock).toBeCalledTimes(1);
    expect(mock).toBeCalledWith("hash", "some:ttl:key", 15, false);
  });
});
