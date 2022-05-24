import React, { FC } from "react";
import styled from "styled-components";

import {
  close,
  fullscreen,
  maximize,
  minimize,
} from "../../services/mainProcess";

import { Title } from "./Title";
import { ButtonWrapper } from "./ButtonWrapper";
import { MacButton } from "./mac-button";

export const Bar = styled.div`
  position: relative;
  top: 0;
  left: 0;
  right: 0;
  padding: 8px;
  display: flex;
  justify-content: space-between;
  flex-direction: row;

  -webkit-app-region: drag;
  -webkit-user-select: none;
`;

const TitleWrapper = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const OSXBar: FC<{ title?: string }> = ({ title }) => {
  const handleClose = () => {
    close();
  };

  const handleMinimize = () => {
    minimize();
  };

  const handleFullscreen = () => {
    fullscreen();
  };

  const handleMaximize = (e: React.MouseEvent) => {
    maximize();
  };

  return (
    <Bar data-testid={"osx-bar"}>
      <ButtonWrapper>
        <MacButton
          color={"hsl(0,100%,66%)"}
          data-testid="frame-close"
          onClick={handleClose}
        ></MacButton>
        <MacButton
          color={"hsl(45,100%,50%)"}
          data-testid="frame-minimize"
          onClick={handleMinimize}
        ></MacButton>
        <MacButton
          color={"hsl(127,98%,40%)"}
          data-testid="frame-fullscreen"
          onClick={handleFullscreen}
        ></MacButton>
      </ButtonWrapper>
      <TitleWrapper onDoubleClick={handleMaximize}>
        <Title data-testid={"frame-titlebar"}>{title}</Title>
      </TitleWrapper>
    </Bar>
  );
};
