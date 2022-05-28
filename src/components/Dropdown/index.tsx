import React, { useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  margin: 0 5px;
  color: ${(props) => props.theme.innerText};
`;

const Select = styled.select`
  height: 40px;
  min-width: 100px;
  border: none;
  appearance: initial;
  padding: 6px 15px 6px 6px;

  background-color: ${(props) => props.theme.foreground};

  color: ${(props) => props.theme.innerText};
`;

const Option = styled.option`
  background-color: #fff;
  color: ${(props) => props.theme.foreground};
  line-height: 30px;
`;

const Arrow = styled.span`
  margin-left: -15px;
  width: 15px;
  text-align: center;

  pointer-events: none;
`;

type Props = {
  items: string[];
  onChange?: (item: string) => void;
  defaultValue?: string;
  defaultIndex?: number;
  "data-testid"?: string;
};

const Dropdown: React.FC<Props> = (props) => {
  const { items, onChange, defaultValue, defaultIndex } = props;
  const [v] = useState(() =>
    defaultValue ? defaultValue : items[defaultIndex ?? 0]
  );

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange && onChange(e.target.value);
  };

  return (
    <Container>
      <Select
        onChange={handleChange}
        defaultValue={v}
        data-testid={props["data-testid"] ?? "dropdown-select"}
      >
        {items.map((item, index) => {
          return (
            <Option key={index} value={item}>
              {item}
            </Option>
          );
        })}
      </Select>
      <Arrow>▾</Arrow>
    </Container>
  );
};

export default Dropdown;
