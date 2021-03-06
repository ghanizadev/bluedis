import React from "react";
import styled from "styled-components";

const Container = styled.div`
  -webkit-app-region: no-drag;
`;

type Props = {
  onChange?: () => void;
  defaultChecked?: boolean;
  checked?: boolean;
};

const Toggle: React.FC<Props> = (props) => {
  const { onChange, defaultChecked, checked } = props;

  return (
    <Container data-testid="toggle">
      <label className="switch">
        <input
          type="checkbox"
          checked={checked}
          defaultChecked={defaultChecked}
          onChange={onChange}
        />
        <span className="slider round"></span>
      </label>
    </Container>
  );
};

export default Toggle;
