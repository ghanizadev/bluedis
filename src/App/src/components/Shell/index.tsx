import React, {useEffect, useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { actions } from "../../redux/store";
import { State } from "../../redux/Types/State";
import { command } from "./comands";
import { executeCommand } from "../../services/mainProcess";
import availableCommands from "./availableCommands.json";

export const Background = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;

  background-color: rgba(0, 0, 0, 0.15);

  display: flex;
  align-items: center;
  justify-content: center;

  z-index: 10;
`;

const Container = styled.section`
  /* flex: 0 1; */
  min-height: 100px;
  overflow: auto;
  background-color: ${(props) => props.theme.sidebarBackground};
  color: ${(props) => props.theme.text};
  border: 1px solid ${(props) => props.theme.text};
  transition: height 250ms ease-out;
  resize: vertical;

  display: flex;
  flex-direction: column;
`;

const Terminal = styled.div`
  background-color: #333;
  color: #fff;
  font-family: "Fira Code", monospace;
  flex: 1;
  flex-basis: 0;
  overflow: auto;
  overflow-y: scroll;
  padding: 5px;
  font-size: 12px;

  & p {
    width: 100%;
    display: flex;
  }

  & div {
    margin-right: 7px;
  }

  & input {
    background-color: transparent;
    border: none;
    cursor: default;
    caret-color: #fff;
    color: inherit;
    font-size: inherit;
    flex: 1;
  }
`;

const Shell: React.FC = () => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const terminal = useSelector<State, { open: boolean; stdout: string[] }>(
    (state) => state.terminal
  );
  const [lastCommands, setLastCommands] = useState<string[]>([]);
  const [current, setCurrent] = useState(-1)

  const dispatch = useDispatch();
  
  useEffect(() => {
    console.log({current, lastCommands})
  }, [current, lastCommands])
  
  useEffect(() => {
    setCurrent(-1)
  }, [terminal])
  
  const roverCommands = (direction: 'ASC' | "DESC") => {
    if(!inputRef.current) return;
    
    if(direction === "ASC") {
      let value = 0;

      if(current === -1) {
        value = lastCommands.length
      }
      
      if(current >= 1) {
        value = current - 1;
      }
      
      if(value) {
        inputRef.current.value = lastCommands[value - 1];
        setCurrent(value)
      }
    } else {
      if(current === lastCommands.length) {
        inputRef.current.value = "";
      } else {
        const value = current + 1;
        inputRef.current.value = lastCommands[value - 1];
        setCurrent(value)
      }
    }
  }

  const handleCommandSubmit = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if(event.ctrlKey && event.key === "c") {
      const value = inputRef.current!.value;
      
      inputRef.current!.value = "";
      dispatch(actions.updateSTDOUT(`> ${value}^C`));
    }
    
    if(event.key === "ArrowUp") {
      return roverCommands("ASC")
    }
    
    if(event.key === "ArrowDown") {
      return roverCommands("DESC")
    }
    
    if (event.key === "Enter" && inputRef.current) {
      const value = inputRef.current!.value;
      if (!value) return;

      inputRef.current!.value = "";
      dispatch(actions.updateSTDOUT(`> ${value}`));

      if ((command as any)[value]) (command as any)[value]();
      else if (
        availableCommands.filter((v) => value.toLowerCase().startsWith(v))
          .length > 0
      ) {
        executeCommand(value);
        setLastCommands(previous => {
          if(previous[previous.length - 1] === value) return previous
          return [...previous, value]
        })
      } else {
        dispatch(actions.updateSTDOUT(`> Command not recognized: ${value}`));
      }

      inputRef.current!.disabled = true;
    }
  };

  const handleOnTerminalClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  React.useEffect(() => {
    if (!inputRef.current) return;
    if (!inputRef.current.disabled) return;

    inputRef.current!.disabled = false;
    inputRef.current!.focus();
    const div = document.querySelector("#terminal")!;
    div.scrollTo({ top: div.scrollTop, behavior: "smooth" });
  }, [terminal.stdout]);

  return (
    <>
      {terminal.open && (
        <Container>
          <Terminal id="terminal" onClick={handleOnTerminalClick}>
            {terminal.stdout.map((command, index) => (
              <div key={index}>{command}</div>
            ))}
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center"
              }}
            >
              <div>{"> "}</div>
              <input
                spellCheck={false}
                ref={inputRef}
                onKeyDown={handleCommandSubmit}
              />
            </div>
          </Terminal>
        </Container>
      )}
    </>
  );
};

export default Shell;
