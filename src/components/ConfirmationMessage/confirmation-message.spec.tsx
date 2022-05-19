import {act, render, screen} from "@testing-library/react";
import {Provider} from "react-redux";

import {Confirmation} from "../../redux/Types/Confirmation";
import ConfirmationMessage from "./index";
import {actions, store} from "../../redux/store";

import '@testing-library/jest-dom/extend-expect';

describe('<ConfirmationMessage />', () => {
  it('Should not render without content', () => {
    const { container } = render(
      <Provider store={store}>
        <ConfirmationMessage />
      </Provider>
    );
    
    expect(container).toBeEmptyDOMElement();
  })

  it('Should render', () => {
    render(
      <Provider store={store}>
        <ConfirmationMessage />
      </Provider>
    );

    const onCancel = jest.fn();
    const onConfirm = jest.fn();
    
    act(() => {
      const content: Confirmation = {
        message: 'The Content',
        title: 'The Title',
        onCancel,
        onConfirm,
      }
      
      store.dispatch(actions.setConfirmation(content));
    })
    
    const message = screen.getByTestId('confirmation-message-container');
    const title = message.querySelector('h3');
    const content = message.querySelector('p');
    
    expect(title).toHaveTextContent('The Title');
    expect(content).toHaveTextContent('The Content');
    expect(message).toBeInTheDocument();
  })

  it('Should cancel and close', () => {
    const { container } = render(
      <Provider store={store}>
        <ConfirmationMessage />
      </Provider>
    );

    const onCancel = jest.fn();
    const onConfirm = jest.fn();

    act(() => {
      const content: Confirmation = {
        message: 'The Content',
        title: 'The Title',
        onCancel,
        onConfirm,
      }

      store.dispatch(actions.setConfirmation(content));
    })

    const message = screen.getByTestId('confirmation-message-container');
    
    expect(message).toBeInTheDocument();
    
    const cancel = screen.getByTestId('confirmation-message-cancel');
    act(() => {
      cancel.click();
    })

    expect(onConfirm).toHaveBeenCalledTimes(0);
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(container).toBeEmptyDOMElement();
  })

  it('Should confirm and close', () => {
    const { container } = render(
      <Provider store={store}>
        <ConfirmationMessage />
      </Provider>
    );

    const onCancel = jest.fn();
    const onConfirm = jest.fn();

    act(() => {
      const content: Confirmation = {
        message: 'The Content',
        title: 'The Title',
        onCancel,
        onConfirm,
      }

      store.dispatch(actions.setConfirmation(content));
    })

    const message = screen.getByTestId('confirmation-message-container');

    expect(message).toBeInTheDocument();

    const confirm = screen.getByTestId('confirmation-message-confirm');
    act(() => {
      confirm.click();
    })

    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onCancel).toHaveBeenCalledTimes(0);
    expect(container).toBeEmptyDOMElement();
  })
})