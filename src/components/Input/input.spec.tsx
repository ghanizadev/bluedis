import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";

import { store } from "../../redux/store";

import Input from "./index";

import "@testing-library/jest-dom/extend-expect";

describe("<Input />", () => {
  it("Should render", () => {
    render(
      <Provider store={store}>
        <Input />
      </Provider>
    );

    const input = screen.getByRole("textbox");

    expect(input).toBeInTheDocument();
  });
});
