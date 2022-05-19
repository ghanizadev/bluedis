import {act, render, screen} from "@testing-library/react";
import {Provider} from "react-redux";

import Loading from "./index";
import {actions, store} from "../../redux/store";

import '@testing-library/jest-dom/extend-expect';

describe('<Loading />', () => {
  it('Should not render', () => {
    const { container } = render(
      <Provider store={store}>
        <Loading />
      </Provider>
    )
    
    expect(container).toBeEmptyDOMElement();
  })

  it('Should render', () => {
    render(
      <Provider store={store}>
        <Loading />
      </Provider>
    )
    
    act(() => {
      store.dispatch(actions.setLoading(true));
    })

    const input = screen.getByTestId('loading');

    expect(input).toBeInTheDocument();
  })
})