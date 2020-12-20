import React from "react";
import { Input } from "./Input";

type Props = {
  label?: string;
  onChangeValue?: (value: boolean) => void;
  defaultChecked?: boolean;
  checked?: boolean;
};

const Checkbox: React.FC<Props> = (props) => {
  const { label, onChangeValue, defaultChecked } = props;

  const handleChecked = () => {
    onChangeValue && onChangeValue(props.checked || defaultChecked || false);
  };

  return (
    <label>
      <Input
        checked={props.checked || props.defaultChecked || false }
        onClick={handleChecked}
      >
        ✓
      </Input>
      {label && (
        <>
          {` ${label}`}
        </>
      )}
    </label>
  );
};

export default Checkbox;
