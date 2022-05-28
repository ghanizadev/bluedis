import React from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";

import { actions } from "../../redux/store";
import { State } from "../../redux/Types/State";
import { executeCommand } from "../../services/main-process";

import { command } from "./comands";
import availableCommands from "./availableCommands.json";

const Container = styled.section`
  min-height: 180px;
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

  const dispatch = useDispatch();

  const handleCommandSubmit = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter" && inputRef.current) {
      const value = inputRef.current.value;

      if (!value) return;

      inputRef.current.value = "";
      dispatch(actions.updateSTDOUT(`> ${value}`));

      if (command[value]) command[value]();
      else if (
        availableCommands.filter((v) => value.toLowerCase().startsWith(v))
          .length > 0
      ) {
        executeCommand(value);
      } else {
        dispatch(actions.updateSTDOUT(`> Command not recognized: ${value}`));
      }

      inputRef.current.disabled = true;
    }
  };

  const handleOnTerminalClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  React.useEffect(() => {
    if (!inputRef.current) return;
    if (!inputRef.current.disabled) return;

    inputRef.current.disabled = false;
    inputRef.current.focus();
    const div = document.querySelector("#terminal");

    if (!div) throw new Error("shell container not found");

    div.scrollTo && div.scrollTo({ top: div.scrollTop, behavior: "smooth" });
  }, [terminal.stdout]);

  return (
    <>
      {terminal.open && (
        <Container>
          <Terminal
            id="terminal"
            onClick={handleOnTerminalClick}
            data-testid={"shell-terminal"}
          >
            {terminal.stdout.map((command, i) => (
              <div key={command + i}>{command}</div>
            ))}
            <div>
              <span>
                {"> "}
                <input
                  data-testid={"shell-input"}
                  spellCheck={false}
                  ref={inputRef}
                  onKeyDown={handleCommandSubmit}
                />
              </span>
            </div>
          </Terminal>
        </Container>
      )}
    </>
  );
};

export default Shell;
