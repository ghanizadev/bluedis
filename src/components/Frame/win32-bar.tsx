import React, { FC } from "react";

import { Title } from "./Title";
import { ButtonWrapper } from "./ButtonWrapper";
import { Resize } from "./Resize";
import { Close } from "./Close";
import { Bar } from "./Bar";
import { appWindow } from "@tauri-apps/api/window";
import styled from "styled-components";

const TitleWrapper = styled.div`
  &:hover {
    cursor: grab;
  }

  &:active {
    cursor: grabbing;
  }
`;

export const Win32Bar: FC<{ title?: string }> = ({ title }) => {
  const handleClose = async () => {
    await appWindow.close();
  };

  const handleMinimize = async () => {
    await appWindow.minimize();
  };

  const handleMaximize = async () => {
    await appWindow.isMaximized()
      ? await appWindow.unmaximize()
      : await appWindow.maximize()
  };

  return (
    <Bar data-testid={"win32-bar"}>
      <TitleWrapper data-tauri-drag-region={true} style={{ display: "flex", flex: 1 }}>
        <img
          src={"/icon.png"}
          alt=""
          style={{ objectFit: "contain", width: 18, height: 18 }}
        />
        <Title data-tauri-drag-region={true} data-testid={"frame-titlebar"}>
          {title}
        </Title>
      </TitleWrapper>
      <ButtonWrapper windows>
        <Resize data-testid="frame-minimize" onClick={handleMinimize} image={"minus"} />
        <Resize data-testid="frame-maximize" onClick={handleMaximize} image={"square"} />
        <Close data-testid="frame-close" onClick={handleClose}  image={"x"} />
      </ButtonWrapper>
    </Bar>
  );
};
