import React, { useRef, useState } from "react";
import styled from "styled-components";
import { useClickOutside } from "../../shared/hooks/use-click-outside.hook";

const Container = styled.div`
  margin: 0 5px;
  color: ${(props) => props.theme.innerText};
  
  position: relative;
`;

const Select = styled.button`
  height: 40px;
  min-width: 120px;
  border: none;
  appearance: initial;
  padding: 12px;

  background-color: ${(props) => props.theme.foreground};

  color: ${(props) => props.theme.innerText};
  
  position: relative;
`;

const Option = styled.div`
  background-color: #fff;
  color: ${(props) => props.theme.foreground};
  line-height: 30px;
  
  &:hover {
    color: ${(props) => props.theme.text};
    background-color: ${(props) => props.theme.foreground};
  }
`;

const Arrow = styled.span`
  margin-left: -20px;
  width: 15px;
  text-align: center;

  pointer-events: none;
  position: absolute;
  top: 20px;
  transform: translateY(-50%);
`;

const Menu = styled.div`
  position: absolute;
  z-index: 1;
  
  top: 40px;
  left: 0;
  right: 0;
  
  max-height: 300px;
  overflow-y: auto;
`;

type Props = {
  items: string[];
  onChange?: (item: string) => any;
  defaultValue?: string;
  defaultIndex?: number;
  "data-testid"?: string;
};

const Dropdown: React.FC<Props> = (props) => {
  const { items, onChange, defaultValue, defaultIndex } = props;
  const [v, sv] = useState<string>(() =>
    defaultValue ? defaultValue : items[defaultIndex ?? 0]
  );
  const [isOpen, setIsOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  useClickOutside(menuRef, () => {
    handleFocus()
  });


  const handleSelect = (item: string) => {
    return async () => {
      if(!onChange) return;
      const success = await onChange(item);

      setIsOpen(false);

      if(typeof success === 'boolean' && !success) return;

      sv(item);
    }
  };

  const handleOpen = () => {
    setIsOpen(o => !o);
  }

  const handleFocus = () => {
    setIsOpen(false);
  }

  return (
    <Container>
      <Select
        onClick={handleOpen}
        data-testid={props["data-testid"] ?? "dropdown-select"}
      >
        {v}
        {isOpen && <Menu ref={menuRef}>
          {items.map((item, index) => {
            return (
              <Option key={item + index} onClick={handleSelect(item)}>
                {item}
              </Option>
            );
          })}
        </Menu>}
      </Select>
      <Arrow>▾</Arrow>
    </Container>
  );
};

export default Dropdown;
