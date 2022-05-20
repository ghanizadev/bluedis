import React, { FC, useEffect } from "react";
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

const Frame: FC<{children?: React.ReactNode | React.ReactNode[]}> = (props) => {
  const connected = useSelector<State, boolean>((state) => state.connected);
  const connection = useSelector<State, Connection | undefined>(
    (state) => state.connection
  );
  const favorites = useSelector<State, Connection[]>(
    (state) => state.favorites
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
  
  const formatName = (name: string) => {
    if (name.length > 30) {
      return ` | [${name.slice(0, 12)}...${name.slice(-12)}]`;
    } else {
      return ` | [${name}]`;
    }
  }
  
  useEffect(() => {
    if(!connection || !connected) {
      setHost("");
      setName("");
      return;
    }
    
    if (connection.host.length > 30) {
      setHost(
        ` - redis${connection.tls ? 's' : ''}://${connection.host.slice(0, 12)}...${connection.host.slice(
          -12
        )}:${connection.port}`
      );
    } else {
      setHost(` - redis${connection.tls ? 's' : ''}://${connection.host}:${connection.port}`);
    }
    
    if(!connection.name) {
      const conn = favorites.find(fav => {
        return fav.host === connection.host
        && fav.port === connection.port
        && fav.password === connection.password
        && fav.tls === connection.tls
      });
      
      if(conn) setName(formatName(conn.name ?? ""));
    } else {
      setName(formatName(connection.name))
    }
  }, [connection, favorites, connected])

  return (
    <Background data-testid="frame">
      <Bar>
        <div style={{ display: "flex" }}>
          <img
            src={process.env.PUBLIC_URL + "/icon.png"}
            alt=""
            style={{ objectFit: "contain", width: 18, height: 18 }}
          />
          <Title data-testid={"frame-titlebar"}>
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
