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

describe("<Home />", () => {
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
});
