import { act, fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";

import { store } from "../../redux/store";

import Dropdown from "./index";

import "@testing-library/jest-dom/extend-expect";

describe("<Dropdown />", () => {
  it("Should render", () => {
    render(
      <Provider store={store}>
        <Dropdown items={["Default"]} />
      </Provider>
    );

    const dropdown = screen.getByTestId("dropdown-select");

    expect(dropdown).toBeInTheDocument();
    expect(dropdown).toHaveTextContent("Default");
  });

  it("Should have default value", () => {
    render(
      <Provider store={store}>
        <Dropdown items={["Default", "Second"]} defaultValue={"Second"} />
      </Provider>
    );

    const dropdown = screen.getByTestId("dropdown-select");

    expect(dropdown).toBeInTheDocument();
    expect(dropdown).toHaveTextContent("Second");
  });

  it("Should have not default value", () => {
    render(
      <Provider store={store}>
        <Dropdown items={["Default", "Second"]} defaultValue={"Third"} />
      </Provider>
    );

    const dropdown = screen.getByTestId("dropdown-select");

    expect(dropdown).toBeInTheDocument();
    expect(dropdown).toHaveTextContent("Default");
  });

  it("Should have default index", () => {
    render(
      <Provider store={store}>
        <Dropdown items={["Default", "Second"]} defaultIndex={1} />
      </Provider>
    );

    const dropdown = screen.getByTestId("dropdown-select");

    expect(dropdown).toBeInTheDocument();
    expect(dropdown).toHaveTextContent("Second");
  });

  it("Should have not default index", () => {
    render(
      <Provider store={store}>
        <Dropdown items={["Default", "Second"]} defaultIndex={2} />
      </Provider>
    );

    const dropdown = screen.getByTestId("dropdown-select");

    expect(dropdown).toBeInTheDocument();
    expect(dropdown).toHaveTextContent("Default");
  });

  it("Should display all options", () => {
    render(
      <Provider store={store}>
        <Dropdown items={["Default", "Second", "Third"]} />
      </Provider>
    );

    const options = screen.getAllByRole("option");
    expect(options).toHaveLength(3);
  });

  it("Should select item", () => {
    const mock = jest.fn();

    render(
      <Provider store={store}>
        <Dropdown items={["Default", "Second", "Third"]} onChange={mock} />
      </Provider>
    );

    const dropdown = screen.getByTestId<HTMLSelectElement>("dropdown-select");

    act(() => {
      /*
       * TODO: Replace change event by useEvents.selectOptions()
       *  it stopped working without any reason
       */
      fireEvent.change(dropdown, { target: { value: "Third" } });
    });

    expect(mock).toHaveBeenCalledTimes(1);
    expect(mock).toHaveBeenLastCalledWith("Third");
  });
});
