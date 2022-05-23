import { act, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";

import { actions, store } from "../../redux/store";

import ErrorMessage from "./index";

import "@testing-library/jest-dom/extend-expect";

describe("<ErrorMessage />", () => {
  it("Should not render", () => {
    const { container } = render(
      <Provider store={store}>
        <ErrorMessage />
      </Provider>
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("Should render", () => {
    const { container } = render(
      <Provider store={store}>
        <ErrorMessage />
      </Provider>
    );

    act(() => {
      store.dispatch(
        actions.setError({
          title: "Error Title",
          message: "error content",
        })
      );
    });

    const error = screen.getByTestId("error-message-container");
    const title = container.querySelector("h3");
    const content = container.querySelector("p");

    expect(error).toBeInTheDocument();
    expect(title).toBeInTheDocument();
    expect(content).toBeInTheDocument();
    expect(title).toHaveTextContent("Error Title");
    expect(content).toHaveTextContent("error content");
  });

  it("Should dismiss", () => {
    const { container } = render(
      <Provider store={store}>
        <ErrorMessage />
      </Provider>
    );

    act(() => {
      store.dispatch(
        actions.setError({
          title: "Error Title",
          message: "error content",
        })
      );
    });

    const error = screen.getByTestId("error-message-container");
    expect(error).toBeInTheDocument();

    act(() => {
      const button = screen.getByRole("button");
      button.click();
    });

    expect(container).toBeEmptyDOMElement();
  });
});
