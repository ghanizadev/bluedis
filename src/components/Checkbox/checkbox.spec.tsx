import { act, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";

import { store } from "../../redux/store";

import Checkbox from "./index";

import "@testing-library/jest-dom/extend-expect";

describe("<Checkbox />", () => {
  it("Should render", () => {
    render(
      <Provider store={store}>
        <Checkbox label={"Some checkbox"} />
      </Provider>
    );

    const checkbox = screen.getByTestId("checkbox-input");
    const label = screen.getByTestId("checkbox-label");

    expect(checkbox).toBeInTheDocument();
    expect(label).toBeInTheDocument();
    expect(label).toHaveTextContent("Some checkbox");
  });

  it("Should should trigger event", () => {
    const mock = jest.fn();
    render(
      <Provider store={store}>
        <Checkbox label={"Some other checkbox"} onChangeValue={mock} />
      </Provider>
    );

    const checkbox = screen.getByTestId("checkbox-input");
    act(() => {
      checkbox.click();
    });

    expect(checkbox).toBeInTheDocument();
    expect(mock).toHaveBeenCalledTimes(1);
    expect(mock).toHaveBeenLastCalledWith(true);
  });

  it("Should should trigger event with default checked", () => {
    const mock = jest.fn();
    render(
      <Provider store={store}>
        <Checkbox
          label={"Some other checkbox"}
          onChangeValue={mock}
          defaultChecked={true}
        />
      </Provider>
    );

    const checkbox = screen.getByTestId("checkbox-input");
    act(() => {
      checkbox.click();
    });

    expect(checkbox).toBeInTheDocument();
    expect(mock).toHaveBeenCalledTimes(1);
    expect(mock).toHaveBeenLastCalledWith(false);
  });
});
