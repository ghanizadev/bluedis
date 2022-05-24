import { act, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";

import { actions, store } from "../../redux/store";

import Preview from "./index";

import "@testing-library/jest-dom/extend-expect";

describe("<Input />", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  it("Should render", () => {
    render(
      <Provider store={store}>
        <Preview />
      </Provider>
    );

    const input = screen.getByTestId("preview-container");

    expect(input).toBeInTheDocument();
  });

  it("Should open", () => {
    const { container } = render(
      <Provider store={store}>
        <Preview />
      </Provider>
    );

    act(() => {
      store.dispatch(
        actions.setPreview({
          value: "something",
          type: "string",
          ttl: -1,
          key: "some:key",
        })
      );
    });

    const close = screen.getByTestId("preview-close");

    act(() => {
      close.click();
    });

    expect(container).toBeInTheDocument();
  });

  it("Should close", () => {
    const mock = jest.fn();

    render(
      <Provider store={store}>
        <Preview onCloseRequest={mock} />
      </Provider>
    );

    act(() => {
      store.dispatch(
        actions.setPreview({
          value: "something",
          type: "string",
          ttl: -1,
          key: "some:key",
        })
      );
    });

    const close = screen.getByTestId("preview-close");

    act(() => {
      close.click();
    });

    expect(mock).toHaveBeenCalledTimes(1);
  });
});
