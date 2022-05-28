import { act, fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";

import { actions, store } from "../../redux/store";
import services from "../../services/services";

import Shell from "./index";
import "@testing-library/jest-dom/extend-expect";

describe("<Search />", () => {
  let sendSpy: jest.SpyInstance;

  beforeEach(() => {
    sendSpy = jest.spyOn(services, "send").mockImplementation(() => ({}));
  });

  it("Should not render", () => {
    const { container } = render(
      <Provider store={store}>
        <Shell />
      </Provider>
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("Should render", () => {
    render(
      <Provider store={store}>
        <Shell />
      </Provider>
    );

    act(() => {
      store.dispatch(actions.setTerminal(true));
    });

    const terminal = screen.getByTestId("shell-terminal");
    const input = screen.getByTestId("shell-input");

    expect(terminal).toBeInTheDocument();
    expect(input).toBeInTheDocument();
  });

  it("Should focus on click", () => {
    render(
      <Provider store={store}>
        <Shell />
      </Provider>
    );

    act(() => {
      store.dispatch(actions.setTerminal(true));
    });

    const terminal = screen.getByTestId("shell-terminal");
    const input = screen.getByTestId("shell-input");

    act(() => {
      terminal.click();
    });

    expect(input).toHaveFocus();
  });

  it("Should send a command", () => {
    render(
      <Provider store={store}>
        <Shell />
      </Provider>
    );

    act(() => {
      store.dispatch(actions.setTerminal(true));
    });

    const input = screen.getByTestId("shell-input");

    act(() => {
      fireEvent.change(input, { target: { value: "del" } });
      fireEvent.keyDown(input, { key: "Enter" });
    });

    expect(sendSpy).toHaveBeenCalledTimes(1);
    expect(sendSpy).toHaveBeenCalledWith("execute", "del");
  });

  it("Should refresh terminal", () => {
    render(
      <Provider store={store}>
        <Shell />
      </Provider>
    );

    act(() => {
      store.dispatch(actions.setTerminal(true));
    });

    const input = screen.getByTestId("shell-input");

    act(() => {
      fireEvent.change(input, { target: { value: "refresh" } });
      fireEvent.keyDown(input, { key: "Enter" });
    });

    expect(sendSpy).toHaveBeenCalledTimes(1);
    expect(sendSpy).toHaveBeenCalledWith("update", {
      count: 0,
      cursor: 0,
      done: false,
      input: "*",
    });
  });

  it("Should clear terminal", () => {
    render(
      <Provider store={store}>
        <Shell />
      </Provider>
    );

    act(() => {
      store.dispatch(actions.setTerminal(true));
    });

    const input = screen.getByTestId("shell-input");

    act(() => {
      fireEvent.change(input, { target: { value: "clear" } });
      fireEvent.keyDown(input, { key: "Enter" });
    });

    expect(sendSpy).toHaveBeenCalledTimes(0);
    expect(store.getState().terminal.stdout).toEqual([]);
  });

  it("Should not send an invalid command", () => {
    render(
      <Provider store={store}>
        <Shell />
      </Provider>
    );

    act(() => {
      store.dispatch(actions.setTerminal(true));
    });

    const input = screen.getByTestId("shell-input");

    act(() => {
      fireEvent.change(input, { target: { value: "hack this" } });
      fireEvent.keyDown(input, { key: "Enter" });
    });

    expect(sendSpy).toHaveBeenCalledTimes(0);
    expect(store.getState().terminal.stdout).toEqual([
      "> hack this",
      "> Command not recognized: hack this",
    ]);
  });

  it("Should show help", () => {
    render(
      <Provider store={store}>
        <Shell />
      </Provider>
    );

    act(() => {
      store.dispatch(actions.setTerminal(true));
    });

    const input = screen.getByTestId("shell-input");

    act(() => {
      fireEvent.change(input, { target: { value: "clear" } });
      fireEvent.keyDown(input, { key: "Enter" });
      fireEvent.change(input, { target: { value: "help" } });
      fireEvent.keyDown(input, { key: "Enter" });
    });

    expect(sendSpy).toHaveBeenCalledTimes(0);
    expect(store.getState().terminal.stdout).toEqual([
      "> help",
      "Almost all Redis commands (as listed here https://redis.io/commands) are available.",
      "If you find any bug, please report to https://github.com/ghanizadev/bluedis/issues",
      "\u00a0",
      "List of available commands: (excluding Redis interface)",
      "\u00a0",
      "  - help: Open this help menu;",
      "  - clear: Clear the terminal;",
      "  - refresh: Update the current list;",
      "  - exit: Close the terminal;",
    ]);
  });

  it("Should exit terminal", () => {
    const { container } = render(
      <Provider store={store}>
        <Shell />
      </Provider>
    );

    act(() => {
      store.dispatch(actions.setTerminal(true));
    });

    expect(
      container.querySelector('[data-testid="shell-terminal"]')
    ).not.toBeNull();
    const input = screen.getByTestId("shell-input");

    act(() => {
      fireEvent.change(input, { target: { value: "exit" } });
      fireEvent.keyDown(input, { key: "Enter" });
    });

    expect(sendSpy).toHaveBeenCalledTimes(0);
    expect(
      container.querySelector('[data-testid="shell-terminal"]')
    ).toBeNull();
  });
});
