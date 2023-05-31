import AddKey from ".";
import { render } from "@testing-library/react";

describe("<AddKey />", () => {
  it("Should render", () => {
    const onConfirm = jest.fn();
    const onCancel = jest.fn();

    const container = render(
      <AddKey onConfirm={onConfirm} onCancel={onCancel} />
    );

    expect(container.getByTestId("add-key-component")).toBeInTheDocument();
  });
});
