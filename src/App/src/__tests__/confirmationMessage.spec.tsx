import "@testing-library/jest-dom";
import { getByTestId, getByText } from "@testing-library/react";
import "jest-styled-components";

import React from "react";
import ReactDOM from "react-dom";
import { act } from "react-dom/test-utils";
import ConfirmationMessage from "../components/ConfirmationMessage";
import { actions, store } from "../redux/store";
import { ThemeWrapper } from "../utils/ThemeWrapper";

let container: HTMLElement | null;

beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  container && document.body.removeChild(container);
  container = null;
});

it("<ConfimationMessage />", async () => {
  const mockCancel = jest.fn();
  const mockConfirm = jest.fn();

  act(() => {
    ReactDOM.render(
      <ThemeWrapper>
        <ConfirmationMessage />
      </ThemeWrapper>,
      container
    );
  });

  expect(container!.querySelector('[data-testid="confirmation-message"]')).toBe(
    null
  );

  const onConfirm = (...args: any[]) => {
    mockConfirm(...args);
  };

  const onCancel = (...args: any[]) => {
    mockCancel(...args);
  };

  act(() => {
    store.dispatch(
      actions.setConfirmation({
        title: "message title",
        message: "message content",
        onConfirm,
        onCancel,
      })
    );
  });

  const wrapper = getByTestId(container!, "confirmation-message");

  expect(wrapper).not.toBeNull();

  const message = container?.querySelector("p");
  const title = container?.querySelector("h3");

  expect(message?.textContent).toBe("message content");
  expect(title?.textContent).toBe("message title");

  expect(mockConfirm).toBeCalledTimes(0);
  expect(mockCancel).toBeCalledTimes(0);

  const confirmButton = getByText(container!, "Confirm");
  act(() => {
    confirmButton.dispatchEvent(new MouseEvent('click', {bubbles: true}));
  });

  expect(container?.querySelector('[data-testid="confirmation-message"]')).toBeNull();
  expect(mockConfirm).toBeCalledTimes(1);

  act(() => {
    store.dispatch(
      actions.setConfirmation({
        title: "message title",
        message: "message content",
        onConfirm,
        onCancel,
      })
    );
  });

  expect(container?.querySelector('[data-testid="confirmation-message"]')).not.toBeNull();
  const cancelButton = getByText(container!, "Cancel");

  act(() => {
    cancelButton.dispatchEvent(new MouseEvent('click', {bubbles: true}));
  });

  expect(container?.querySelector('[data-testid="confirmation-message"]')).toBeNull();
  expect(mockCancel).toBeCalledTimes(1);
});
