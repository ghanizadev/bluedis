import React from "react";
import styled from "styled-components";

const Container = styled.div`
  -webkit-app-region: no-drag;
`;

type Props = {
  onChange?: () => void;
  defaultChecked?: boolean;
  checked?: boolean;
  'data-testid'?: string;
};

const Toggle: React.FC<Props> = (props) => {
  const { onChange, defaultChecked, checked } = props;

  return (
    <Container data-testid="toggle-container">
      <label className="switch">
        <input
          type="checkbox"
          checked={checked}
          defaultChecked={defaultChecked}
          onChange={onChange}
          data-testid={props["data-testid"] ?? 'toggle-input'}
        />
        <span className="slider round"></span>
      </label>
    </Container>
  );
};

export default Toggle;
