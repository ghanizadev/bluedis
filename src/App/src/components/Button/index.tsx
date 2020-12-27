import React from "react";
import { Container } from "./Container";
import { Text } from "./Text";

type Props = {
  label: string;
  onClick ?: () => void;
}

const Button: React.FC<Props> = (props) => {
  const {label, onClick} = props;
  return(
    <Container data-testid="square-button" onClick={onClick}>
      <Text>
        {label}
      </Text>
    </Container>
  )
}

export default Button;