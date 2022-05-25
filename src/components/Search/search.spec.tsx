import { act, fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";

import { store } from "../../redux/store";
import services from "../../services/services";

import Search from "./index";
import "@testing-library/jest-dom/extend-expect";

describe("<Search />", () => {
  let sendSpy: jest.SpyInstance;

  beforeEach(() => {
    sendSpy = jest.spyOn(services, "send").mockImplementation(() => ({}));
  });

  it("Should render", () => {
    render(
      <Provider store={store}>
        <Search />
      </Provider>
    );

    const input = screen.getByTestId("search-input");
    const dropdown = screen.getByTestId("search-dropdown");
    const button = screen.getByTestId("search-button");

    expect(input).toBeInTheDocument();
    expect(dropdown).toBeInTheDocument();
    expect(button).toBeInTheDocument();
  });

  it("Should search by button click", () => {
    render(
      <Provider store={store}>
        <Search />
      </Provider>
    );

    const input = screen.getByTestId("search-input");
    const button = screen.getByTestId("search-button");

    act(() => {
      fireEvent.change(input, { target: { value: "my search" } });
      button.click();
    });

    expect(sendSpy).toHaveBeenCalledTimes(1);
    expect(sendSpy).toHaveBeenCalledWith("find", "my search", 0);
  });

  it("Should search by pressing enter", () => {
    render(
      <Provider store={store}>
        <Search />
      </Provider>
    );

    const input = screen.getByTestId("search-input");

    act(() => {
      fireEvent.change(input, { target: { value: "my other search" } });
      fireEvent.keyDown(input, { key: "Enter" });
    });

    expect(sendSpy).toHaveBeenCalledTimes(1);
    expect(sendSpy).toHaveBeenCalledWith("find", "my other search", 0);
  });

  it("Should change dropdown", () => {
    render(
      <Provider store={store}>
        <Search />
      </Provider>
    );

    const dropdown = screen.getByTestId("search-dropdown");

    act(() => {
      fireEvent.change(dropdown, { target: { value: "DB 3" } });
    });

    expect(sendSpy).toHaveBeenCalledTimes(1);
    expect(sendSpy).toHaveBeenCalledWith("selectDatabase", 3);
  });
});
