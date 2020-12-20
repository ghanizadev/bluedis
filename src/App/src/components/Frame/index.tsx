import React from "react";
import { Background } from "./Background";
import { Bar } from "./Bar";
import { Close } from "./Close";
import { Minimize } from "./Minimize";
import { WorkingArea } from "./WorkingArea";
import { Title } from "./Title";
import { close, maximize, minimize } from "../../services/mainProcess";
import { ButtonWrapper } from "./ButtonWrapper";

import { ReactComponent as CloseIcon } from "../../assets/close.svg";
import { ReactComponent as MinimizeIcon } from "../../assets/minus.svg";
import { ReactComponent as MaximizeIcon } from "../../assets/square.svg";

const Frame: React.FC = (props) => {

  const handleClose = () => {
    close();
  };

  const handleMinimize = () => {
    minimize();
  };

  const handleMaximize = () => {
    maximize();
  };

  return (
    <Background>
      <Bar>
        <Title>Bluedis - v1.0.0</Title>
        <ButtonWrapper>
          <Minimize onClick={handleMinimize}>
            <MinimizeIcon width={16} height={16} />
          </Minimize>
          <Minimize onClick={handleMaximize}>
            <MaximizeIcon width={16} height={16} />
          </Minimize>
          <Close onClick={handleClose}>
            <CloseIcon width={16} height={16} />
          </Close>
        </ButtonWrapper>
      </Bar>
      <WorkingArea>{props.children}</WorkingArea>
    </Background>
  );
};

export default Frame;
