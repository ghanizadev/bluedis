import React from "react";
import { Container } from "./Container";
import { Text } from "./Text";

type Props = {
  label: string;
  onClick ?: () => void;
  disabled?: boolean;
}

const Button: React.FC<Props> = (props) => {
  const {label, onClick, disabled} = props;
  return(
    <Container disabled={disabled} data-testid="square-button" onClick={onClick}>
      <Text>
        {label}
      </Text>
    </Container>
  )
}

export default Button;