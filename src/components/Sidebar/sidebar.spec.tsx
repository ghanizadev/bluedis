import { Provider } from "react-redux";
import { act, fireEvent, render, screen } from "@testing-library/react";

import { store } from "../../redux/store";

import Sidebar from "./index";
import "@testing-library/jest-dom/extend-expect";

describe("<Sidebar />", () => {
  it("Should render", () => {
    render(
      <Provider store={store}>
        <Sidebar />
      </Provider>
    );

    const sidebar = screen.getByTestId("menu-sidebar");
    expect(sidebar).toBeInTheDocument();
  });

  it("Should open/close", () => {
    render(
      <Provider store={store}>
        <Sidebar />
      </Provider>
    );

    expect(getComputedStyle(screen.getByTestId("menu-sidebar")).width).toEqual(
      "35px"
    );
    expect(getComputedStyle(screen.getByTestId("menu-sidebar")).width).toEqual(
      "35px"
    );

    const menuButton = screen.getByTestId("menu-button");

    act(() => {
      fireEvent.click(menuButton);
    });

    expect(getComputedStyle(screen.getByTestId("menu-sidebar")).width).toEqual(
      "200px"
    );

    act(() => {
      fireEvent.click(menuButton);
    });

    expect(getComputedStyle(screen.getByTestId("menu-sidebar")).width).toEqual(
      "35px"
    );
  });

  it("Should go to database page", () => {
    render(
      <Provider store={store}>
        <Sidebar />
      </Provider>
    );

    const database = screen.getByTestId("menu-database");
    act(() => {
      database.click();
    });

    expect(store.getState().currentPage).toEqual("database");
  });

  it("Should go to settings page", () => {
    render(
      <Provider store={store}>
        <Sidebar />
      </Provider>
    );

    const settings = screen.getByTestId("menu-settings");
    act(() => {
      settings.click();
    });

    expect(store.getState().currentPage).toEqual("settings");
  });

  it("Should go to help page", () => {
    render(
      <Provider store={store}>
        <Sidebar />
      </Provider>
    );

    const help = screen.getByTestId("menu-help");
    act(() => {
      help.click();
    });

    expect(store.getState().currentPage).toEqual("help");
  });
});
