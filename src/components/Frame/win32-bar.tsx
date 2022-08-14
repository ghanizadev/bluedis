import React, { FC } from "react";

import MinimizeIcon from "../../assets/Minus";
import MaximizeIcon from "../../assets/Square";
import CloseIcon from "../../assets/Close";
// import { close, maximize, minimize } from "../../services/main-process";

import { Title } from "./Title";
import { ButtonWrapper } from "./ButtonWrapper";
import { Resize } from "./Resize";
import { Close } from "./Close";
import { Bar } from "./Bar";

export const Win32Bar: FC<{ title?: string }> = ({ title }) => {
  const handleClose = () => {
    // close();
  };

  const handleMinimize = () => {
    // minimize();
  };

  const handleMaximize = () => {
    // maximize();
  };

  return (
    <Bar data-testid={"win32-bar"}>
      <div style={{ display: "flex", flex: 1 }}>
        <img
          src={"/icon.png"}
          alt=""
          style={{ objectFit: "contain", width: 18, height: 18 }}
        />
        <Title data-testid={"frame-titlebar"}>{title}</Title>
      </div>
      <ButtonWrapper>
        <Resize data-testid="frame-minimize" onClick={handleMinimize}>
          <MinimizeIcon width={16} height={16} />
        </Resize>
        <Resize data-testid="frame-maximize" onClick={handleMaximize}>
          <MaximizeIcon width={16} height={16} />
        </Resize>
        <Close data-testid="frame-close" onClick={handleClose}>
          <CloseIcon width={16} height={16} />
        </Close>
      </ButtonWrapper>
    </Bar>
  );
};
