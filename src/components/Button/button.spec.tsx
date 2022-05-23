import { act, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";

import { store } from "../../redux/store";

import Button from "./index";

import "@testing-library/jest-dom/extend-expect";

describe("<Button />", () => {
  it("Should render", () => {
    render(
      <Provider store={store}>
        <Button label={"Some label"} />
      </Provider>
    );

    const button = screen.getByTestId("square-button");

    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("Some label");
  });

  it("Should fire click event", () => {
    const mock = jest.fn();

    render(
      <Provider store={store}>
        <Button label={"Some label"} onClick={mock} />
      </Provider>
    );

    const button = screen.getByTestId("square-button");
    act(() => {
      button.click();
    });

    expect(mock).toHaveBeenCalledTimes(1);
  });

  it("Should not fire click event when disabled", () => {
    const mock = jest.fn();

    render(
      <Provider store={store}>
        <Button label={"Some label"} onClick={mock} disabled />
      </Provider>
    );

    const button = screen.getByTestId("square-button");
    act(() => {
      button.click();
    });

    expect(mock).toHaveBeenCalledTimes(0);
  });
});
