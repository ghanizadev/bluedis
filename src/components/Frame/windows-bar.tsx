import {Title} from "./Title";
import {ButtonWrapper} from "./ButtonWrapper";
import {Resize} from "./Resize";
import {ReactComponent as MinimizeIcon} from "../../assets/minus.svg";
import {ReactComponent as MaximizeIcon} from "../../assets/square.svg";
import {Close} from "./Close";
import {ReactComponent as CloseIcon} from "../../assets/close.svg";
import {Bar} from "./Bar";
import React, {FC} from "react";
import {close, maximize, minimize} from "../../services/mainProcess";

export const WindowsBar: FC<{title?: string}> = ({ title }) => {
  const handleClose = () => {
    close();
  };

  const handleMinimize = () => {
    minimize();
  };

  const handleMaximize = () => {
    maximize();
  };

  const handleDoubleClickMaximize = (e: React.MouseEvent) => {
    if(e.detail === 2)
      maximize();
  };
  
  return (
    <Bar>
      <div
        onClick={handleDoubleClickMaximize}
        style={{ display: "flex", flex: 1 }}
      >
        <img
          src={process.env.PUBLIC_URL + "/icon.png"}
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
  )
}