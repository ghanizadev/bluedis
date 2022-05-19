import React from 'react';
import Spinner from './Spinner';
import styled from "styled-components";
import { useSelector } from 'react-redux';
import { State } from '../../redux/Types/State';

const Container = styled.div<{isLoading?: boolean}>`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.6);

  display: ${props => props.isLoading ? "grid" : "none"};
  place-items: center;
`;

const Loading: React.FC = () => {
  const isLoading = useSelector<State, boolean>(state => state.isLoading);

  return (
    <Container isLoading={isLoading}>
      <Spinner />
    </Container>
  );
}

export default Loading;