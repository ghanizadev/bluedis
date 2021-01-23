import React, { useEffect } from "react";
import { Input } from "./Input";

type Props = {
  label?: string;
  onChangeValue?: (value: boolean) => void;
  defaultChecked?: boolean;
  checked?: boolean;
};

const Checkbox: React.FC<Props> = (props) => {
  const { label, onChangeValue, defaultChecked } = props;
  const [checked, setChecked] = React.useState(
    props.checked || defaultChecked || false
  );

  const handleChecked = () => {
    setChecked(!checked);
    onChangeValue && onChangeValue(!checked);
  };

  useEffect(() => {
    if (typeof props.checked === "boolean") setChecked(props.checked);
  }, [props.checked]);

  return (
    <label>
      <Input
        data-testid="checkbox-input"
        checked={checked}
        onClick={handleChecked}
      >
        ✓
      </Input>
      {label && <>{` ${label}`}</>}
    </label>
  );
};

export default Checkbox;
