import React, { FC, useState } from "react";
import styled from "styled-components";

import CloseIcon from "../../assets/Close";
import MinimizeIcon from "../../assets/Minimize";
import MaximizeIcon from "../../assets/Maximize";
// import {
//   close,
//   fullscreen,
//   maximize,
//   minimize,
// } from "../../services/main-process";
import { useBlur } from "../../shared/hooks/use-blur.hook";

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
  const [hover, setHover] = useState(false);
  const { isBlurred } = useBlur();

  const handleClose = () => {
    // close();
  };

  const handleMinimize = () => {
    // minimize();
  };

  const handleFullscreen = () => {
    // fullscreen();
  };

  const handleMaximize = () => {
    // maximize();
  };

  return (
    <Bar data-testid={"osx-bar"}>
      <ButtonWrapper
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <MacButton
          color={isBlurred ? "#ccc" : "hsl(0,100%,66%)"}
          data-testid="frame-close"
          onClick={handleClose}
        >
          {hover && <CloseIcon width={10} height={10} strokeWidth={2} />}
        </MacButton>
        <MacButton
          color={isBlurred ? "#ccc" : "hsl(45,100%,50%)"}
          data-testid="frame-minimize"
          onClick={handleMinimize}
        >
          {hover && <MinimizeIcon width={10} height={10} strokeWidth={2} />}
        </MacButton>
        <MacButton
          color={isBlurred ? "#ccc" : "hsl(127,98%,40%)"}
          data-testid="frame-fullscreen"
          onClick={handleFullscreen}
        >
          {hover && <MaximizeIcon width={10} height={10} strokeWidth={2} />}
        </MacButton>
      </ButtonWrapper>
      <TitleWrapper onDoubleClick={handleMaximize}>
        <Title data-testid={"frame-titlebar"}>{title}</Title>
      </TitleWrapper>
    </Bar>
  );
};
