import "@testing-library/jest-dom";
import "jest-styled-components";
import "../utils/WindowRequireMock";

import React from "react";
import ReactDOM from "react-dom";
import { act } from "react-dom/test-utils";
import App from "../App";
import { ThemeWrapper } from "../utils/ThemeWrapper";
import { fireEvent, getByTestId, getByText } from "@testing-library/react";
import { actions, store } from "../redux/store";
import mocks from "../utils/WindowRequireMock";

describe("<Connect />", () => {
  let container: HTMLElement | null;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container && document.body.removeChild(container);
    container = null;
  });

  it("should render", (done) => {
    act(() => {
      ReactDOM.render(
        <ThemeWrapper>
          <App />
        </ThemeWrapper>,
        container
      );
    });

    expect(container).not.toBeNull();
    done();
  });

  it("should have a form", (done) => {
    act(() => {
      ReactDOM.render(
        <ThemeWrapper>
          <App />
        </ThemeWrapper>,
        container
      );
    });

    const connectForm = getByTestId(container!, "connect-form");

    expect(connectForm.querySelectorAll("input").length).toBe(3);
    expect(connectForm.querySelectorAll("button").length).toBe(1);
    done();
  });

  it("should submit the form", (done) => {
    act(() => {
      ReactDOM.render(
        <ThemeWrapper>
          <App />
        </ThemeWrapper>,
        container
      );
    });

    const connectForm = getByTestId(container!, "connect-form");

    const inputs = connectForm.querySelectorAll("input");
    const submit = connectForm.querySelector("button")!;

    act(() => {
      fireEvent.change(inputs[2], { target: { value: "password" } });
    });
    act(() => {
      fireEvent.change(inputs[0], { target: { value: "host" } });
    });
    act(() => {
      fireEvent.change(inputs[1], { target: { value: "port" } });
    });

    expect(inputs[0].value).toBe("host");
    expect(inputs[1].value).toBe("port");
    expect(inputs[2].value).toBe("password");

    act(() => {
      fireEvent.click(submit, { bubbles: true });
    });

    expect(mocks.ipcRenderer.send).toHaveBeenNthCalledWith(2, "connect", {
      host: "host",
      password: "password",
      port: "port",
      tls: false,
    });
    done();
  });

  
  it("should remove a favorite", (done) => {
    act(() => {
      ReactDOM.render(
        <ThemeWrapper>
          <App />
        </ThemeWrapper>,
        container
      );
    });

    act(() => {
      store.dispatch(actions.addFavorite({host: "host", id: "id", port: "port", tls: false, name: "some name", password: "some password"}))
    });

    expect(getByText(container!, "redis://host:port")).not.toBeNull();
    expect(getByText(container!, "some name")).not.toBeNull();

    const closeButton = getByText(container!, "redis://host:port").parentElement?.nextElementSibling;
    expect(closeButton).not.toBeNull();

    act(() => {
      fireEvent.click(closeButton!, {bubbles: true});
    });

    const favorites = store.getState().favorites;

    const noElements = getByText(container!, "No favorites so far...");
    expect(favorites.length).toBe(0);
    expect(noElements).not.toBeNull();
    expect(noElements.parentElement?.children.length).toBe(1);

    done();
  });

  it("should connect from a favorite", (done) => {
    act(() => {
      ReactDOM.render(
        <ThemeWrapper>
          <App />
        </ThemeWrapper>,
        container
      );
    });

    act(() => {
      store.dispatch(actions.addFavorite({host: "host", id: "id", port: "port", tls: false, name: "some name", password: "some password"}))
    });

    const button = getByText(container!, "some name").parentElement?.parentElement;

    act(() => {
      fireEvent.click(button!, {bubbles: true});
    });

    expect(mocks.ipcRenderer.send).toHaveBeenNthCalledWith(2, "connect", {
      host: "host",
      password: "some password",
      port: "port",
      tls: false,
      id: "id",
      name: "some name"
    });

    done();
  });
});
