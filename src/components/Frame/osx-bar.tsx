import React, { FC, useEffect, useState } from "react";
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
import { appWindow } from "@tauri-apps/api/window";

export const Bar = styled.div`
  position: relative;
  top: 0;
  left: 0;
  right: 0;
  padding: 8px;
  display: flex;
  justify-content: space-between;
  flex-direction: row;
`;

const TitleWrapper = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 22px;

  &:hover {
    cursor: grab;
  }

  &:active {
    cursor: grabbing;
  }
`;

let unlistenResize: () => void = () => {};

export const OSXBar: FC<{ title?: string }> = ({ title }) => {
  const [hover, setHover] = useState(false);
  const { isBlurred } = useBlur();
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleClose = () => {
    appWindow.close();
  };

  const handleMinimize = () => {
    appWindow.minimize();
  };

  const handleFullscreen = async () => {
    await appWindow.setFullscreen(true);
  };

  const handleMaximize = () => {
    appWindow.maximize();
  };

  useEffect(() => {
    appWindow
      .onResized(async () => {
        let fullscreen = await appWindow.isFullscreen();
        setIsFullscreen(fullscreen);
        setHover(false);
      })
      .then((fn) => {
        unlistenResize = fn;
      });

    return () => {
      unlistenResize && unlistenResize();
    };
  }, [isFullscreen]);

  if (isFullscreen) return <></>;

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
          image={"close"}
          hover={hover}
        />
        <MacButton
          color={isBlurred ? "#ccc" : "hsl(45,100%,50%)"}
          data-testid="frame-minimize"
          onClick={handleMinimize}
          image={"minimize"}
          hover={hover}
        />
        <MacButton
          color={isBlurred ? "#ccc" : "hsl(127,98%,40%)"}
          data-testid="frame-fullscreen"
          onClick={handleFullscreen}
          image={"maximize"}
          hover={hover}
        />
      </ButtonWrapper>
      <TitleWrapper
        data-tauri-drag-region={true}
        onDoubleClick={handleMaximize}
      >
        <Title data-tauri-drag-region={true} data-testid={"frame-titlebar"}>
          {title}
        </Title>
      </TitleWrapper>
    </Bar>
  );
};
