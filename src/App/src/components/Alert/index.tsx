import React from "react";
import styled from "styled-components";

const Container = styled.div``;
const Content = styled.div``;
const Background = styled.div``;

type Props = {
  title: string;
  message: string;
  visible: boolean
}

const Modal: React.FC<Props> = (props) => {
  const {title, visible, message} = props;
  
  return(
    <Container style={{display: visible ? "block" : "none"}}>
      <Background />
      <Content>
        <h2>{title}</h2>
        <p>{message}</p>
      </Content>
    </Container>
  )
}

export default Modal;