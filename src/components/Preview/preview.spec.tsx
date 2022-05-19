import {render, screen} from "@testing-library/react";
import {Provider} from "react-redux";

import Preview from "./index";
import {store} from "../../redux/store";

import '@testing-library/jest-dom/extend-expect';

describe('<Input />', () => {
  it('Should render', () => {
    render(
      <Provider store={store}>
          <Preview />
      </Provider>
    )

    const input = screen.getByTestId('preview-container');

    expect(input).toBeInTheDocument();
  })
})