import { act, fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";

import services from "../../services/services";
import { actions, store } from "../../redux/store";

import EditTTL from "./index";

import "@testing-library/jest-dom/extend-expect";

describe("<EditTTL />", () => {
  let sendSpy: jest.SpyInstance;

  beforeEach(() => {
    sendSpy = jest.spyOn(services, "send").mockImplementation(() => ({}));
  });

  it("Should not render", () => {
    const { container } = render(
      <Provider store={store}>
        <EditTTL />
      </Provider>
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("Should render", () => {
    render(
      <Provider store={store}>
        <EditTTL />
      </Provider>
    );

    const timestamp = Date.now();

    act(() => {
      store.dispatch(
        actions.setEditTTL({
          key: "some:key",
          ttl: timestamp,
          type: "zset",
          value: "some value",
        })
      );
    });

    const edit = screen.getByTestId("edit-ttl-container");
    const label = screen.getByTestId("edit-ttl-label");
    const input = screen.getByTestId("edit-ttl-input");
    const toggle = screen.getByTestId("edit-ttl-toggle");
    const cancel = screen.getByTestId("edit-ttl-cancel");
    const confirm = screen.getByTestId("edit-ttl-confirm");

    expect(edit).toBeInTheDocument();
    expect(label).toBeInTheDocument();
    expect(input).toBeInTheDocument();
    expect(toggle).toBeInTheDocument();
    expect(cancel).toBeInTheDocument();
    expect(confirm).toBeInTheDocument();

    expect(label).toHaveTextContent(
      new Date(timestamp).toLocaleString(navigator.language, {
        timeZoneName: "short",
      })
    );
  });

  it("Should cancel", () => {
    render(
      <Provider store={store}>
        <EditTTL />
      </Provider>
    );

    act(() => {
      store.dispatch(
        actions.setEditTTL({
          key: "some:key",
          ttl: Date.now(),
          type: "zset",
          value: "some value",
        })
      );
    });

    const cancel = screen.getByTestId("edit-ttl-cancel");

    act(() => {
      cancel.click();
    });

    expect(sendSpy).toHaveBeenCalledTimes(0);
  });

  it("Should add relative TTL", () => {
    render(
      <Provider store={store}>
        <EditTTL />
      </Provider>
    );

    const timestamp = Date.now();

    act(() => {
      store.dispatch(
        actions.setEditTTL({
          key: "some:key",
          ttl: timestamp,
          type: "zset",
          value: "some value",
        })
      );
    });

    act(() => {
      const input = screen.getByTestId("edit-ttl-input");
      fireEvent.change(input, { target: { value: "500" } });

      const confirm = screen.getByTestId("edit-ttl-confirm");
      confirm.click();
    });

    expect(sendSpy).toHaveBeenCalledTimes(1);
    expect(sendSpy).toHaveBeenCalledWith("setTTL", "some:key", 500);
  });

  it("Should add absolute TTL", () => {
    render(
      <Provider store={store}>
        <EditTTL />
      </Provider>
    );

    const timestamp = Date.now();

    act(() => {
      store.dispatch(
        actions.setEditTTL({
          key: "some:other:key",
          ttl: timestamp,
          type: "string",
          value: "some other value",
        })
      );
    });

    const now = "2018-06-07T00:00";

    act(() => {
      const toggle = screen.getByTestId("edit-ttl-toggle");
      toggle.click();

      const input = screen.getByTestId<HTMLInputElement>("edit-ttl-input");
      fireEvent.change(input, { target: { value: now } });

      const confirm = screen.getByTestId("edit-ttl-confirm");
      confirm.click();
    });

    expect(sendSpy).toHaveBeenCalledTimes(1);
    expect(sendSpy).toHaveBeenCalledWith("setTTL", "some:other:key", now);
  });

  it("Should add remove TTL", () => {
    render(
      <Provider store={store}>
        <EditTTL />
      </Provider>
    );

    const timestamp = Date.now();

    act(() => {
      store.dispatch(
        actions.setEditTTL({
          key: "some:other:key",
          ttl: timestamp,
          type: "string",
          value: "some other value",
        })
      );
    });

    act(() => {
      const remove = screen.getByTestId("edit-ttl-remove");
      remove.click();
    });

    expect(sendSpy).toHaveBeenCalledTimes(1);
    expect(sendSpy).toHaveBeenCalledWith("removeTTL", "some:other:key");
  });

  it("Should display 'not set' when does not have TTL", () => {
    render(
      <Provider store={store}>
        <EditTTL />
      </Provider>
    );

    act(() => {
      store.dispatch(
        actions.setEditTTL({
          key: "some:other:key",
          ttl: -1,
          type: "string",
          value: "some other value",
        })
      );
    });

    const label = screen.getByTestId("edit-ttl-label");

    expect(label).toHaveTextContent("not set");
    expect(sendSpy).toHaveBeenCalledTimes(0);
  });
});
