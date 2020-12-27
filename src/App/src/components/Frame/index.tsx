import React from "react";
import { Background } from "./Background";
import { Bar } from "./Bar";
import { Close } from "./Close";
import { Resize } from "./Resize";
import { WorkingArea } from "./WorkingArea";
import { Title } from "./Title";
import { close, maximize, minimize } from "../../services/mainProcess";
import { ButtonWrapper } from "./ButtonWrapper";

import { ReactComponent as CloseIcon } from "../../assets/close.svg";
import { ReactComponent as MinimizeIcon } from "../../assets/minus.svg";
import { ReactComponent as MaximizeIcon } from "../../assets/square.svg";
import { useSelector } from "react-redux";
import { State } from "../../redux/Types/State";
import { Connection } from "../../redux/Types/Connection";

const Frame: React.FC = (props) => {
  const connected = useSelector<State, boolean>((state) => state.connected);
  const connection = useSelector<State, Connection | undefined>(
    (state) => state.connection
  );

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
    <Background data-testid="frame">
      <Bar>
        <div style={{display: "flex"}}>
          <img
            src={process.env.PUBLIC_URL + "/icon.png"}
            alt=""
            style={{ objectFit: "contain", width: 18, height: 18 }}
          />
          <Title>
            Bluedis
            {connected && ` - redis://${connection?.host}:${connection?.port}`}
            {connected && connection?.name && ` | [${connection?.name}]`}
          </Title>
        </div>
        <ButtonWrapper>
          <Resize  data-testid="frame-minimize" onClick={handleMinimize}>
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
      <WorkingArea>{props.children}</WorkingArea>
    </Background>
  );
};

export default Frame;
