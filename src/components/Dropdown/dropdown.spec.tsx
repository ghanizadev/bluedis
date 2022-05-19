import {render, screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {Provider} from "react-redux";

import Dropdown from "./index";
import {store} from "../../redux/store";

import '@testing-library/jest-dom/extend-expect';

describe('<Dropdown />', () => {
  it('Should render', () => {
    render(
      <Provider store={store}>
        <Dropdown items={['Default']} />
      </Provider>
    )
    
    const dropdown = screen.getByTestId('dropdown-select');
    
    expect(dropdown).toBeInTheDocument();
    expect(dropdown).toHaveTextContent('Default');
  })

  it('Should have default value', () => {
    render(
      <Provider store={store}>
        <Dropdown items={['Default', 'Second']} defaultValue={'Second'} />
      </Provider>
    )

    const dropdown = screen.getByTestId('dropdown-select');

    expect(dropdown).toBeInTheDocument();
    expect(dropdown).toHaveTextContent('Second');
  })

  it('Should have not default value', () => {
    render(
      <Provider store={store}>
        <Dropdown items={['Default', 'Second']} defaultValue={'Third'} />
      </Provider>
    )

    const dropdown = screen.getByTestId('dropdown-select');

    expect(dropdown).toBeInTheDocument();
    expect(dropdown).toHaveTextContent('Default');
  })

  it('Should have default index', () => {
    render(
      <Provider store={store}>
        <Dropdown items={['Default', 'Second']} defaultIndex={1} />
      </Provider>
    )

    const dropdown = screen.getByTestId('dropdown-select');

    expect(dropdown).toBeInTheDocument();
    expect(dropdown).toHaveTextContent('Second');
  })

  it('Should have not default index', () => {
    render(
      <Provider store={store}>
        <Dropdown items={['Default', 'Second']} defaultIndex={2} />
      </Provider>
    )

    const dropdown = screen.getByTestId('dropdown-select');

    expect(dropdown).toBeInTheDocument();
    expect(dropdown).toHaveTextContent('Default');
  })

  it('Should display all options', () => {
    render(
      <Provider store={store}>
        <Dropdown items={['Default', 'Second', 'Third']} />
      </Provider>
    )

    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(3);
  })

  it('Should select item', () => {
    const mock = jest.fn();
    
    render(
      <Provider store={store}>
        <Dropdown items={['Default', 'Second', 'Third']} onChange={mock} />
      </Provider>
    )

    const dropdown = screen.getByTestId('dropdown-select');
    const selected = screen.getByRole<HTMLOptionElement>('option', { name: 'Third' });
    
    userEvent.selectOptions(
      dropdown,
      selected,
    );

    expect(selected.selected).toBeTruthy();
    expect(mock).toHaveBeenCalledTimes(1);
    expect(mock).toHaveBeenLastCalledWith('Third');
  })
})