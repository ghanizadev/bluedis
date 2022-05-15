import React, {FC, useEffect} from "react";
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

const Frame: FC<any> = (props) => {
  const connected = useSelector<State, boolean>((state) => state.connected);
  const connection = useSelector<State, Connection | undefined>(
    (state) => state.connection
  );
  const [host, setHost] = React.useState("");
  const [name, setName] = React.useState("");

  const handleClose = () => {
    close();
  };

  const handleMinimize = () => {
    minimize();
  };

  const handleMaximize = () => {
    maximize();
  };

  useEffect(() => {
    if (connection && connected) {
      if (connection.host.length > 30) {
        setHost(
          ` - redis://${connection.host.slice(0, 12)}...${connection.host.slice(
            -12
          )}:${connection.port}`
        );
      } else {
        setHost(` - redis://${connection.host}:${connection.port}`);
      }
      if (connection.name) {
        if (connection.name.length > 30) {
          setName(
            ` | [${connection.name.slice(0, 12)}...${connection.name.slice(
              -12
            )}]`
          );
        } else {
          setName(` | [${connection.name}]`);
        }
      } else {
        setName("");
      }
    } else {
      setHost("");
      setName("");
    }

    console.log(connection);
  }, [connection, connected]);

  return (
    <Background data-testid="frame">
      <Bar>
        <div style={{ display: "flex" }}>
          <img
            src={process.env.PUBLIC_URL + "/icon.png"}
            alt=""
            style={{ objectFit: "contain", width: 18, height: 18 }}
          />
          <Title>
            Bluedis
            {host}
            {name}
          </Title>
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
      <WorkingArea>{props.children}</WorkingArea>
    </Background>
  );
};

export default Frame;
