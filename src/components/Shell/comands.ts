import { actions, store } from "../../redux/store";
import { updateData } from "../../services/main-process";

export const command: { [key: string]: () => void } = {
  clear: () => store.dispatch(actions.clearSTDOUT()),
  refresh: () => updateData(),
  exit: () => {
    store.dispatch(actions.clearSTDOUT());
    store.dispatch(actions.setTerminal(false));
  },
  help: () => {
    [
      "Almost all Redis commands (as listed here https://redis.io/commands) are available.",
      "If you find any bug, please report to https://github.com/ghanizadev/bluedis/issues",
      "\u00a0",
      "List of available commands: (excluding Redis interface)",
      "\u00a0",
      "  - help: Open this help menu;",
      "  - clear: Clear the terminal;",
      "  - refresh: Update the current list;",
      "  - exit: Close the terminal;",
    ].forEach((line) => store.dispatch(actions.updateSTDOUT(line)));
  },
};
