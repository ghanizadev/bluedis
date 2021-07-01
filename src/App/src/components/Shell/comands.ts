import { store, actions } from "../../redux/store";
import { updateData } from "../../services/mainProcess";

export const command = {
  clear: () => store.dispatch(actions.clearSTDOUT()),
  refresh: () => updateData(),
  exit: () => {
    store.dispatch(actions.clearSTDOUT());
    store.dispatch(actions.setTerminal(false));
  },
  help: () => {
    [
      "Most of all Redis commands (as listed here https://redis.io/commands) are available.",
      "If you find any bug, please report to https://github.com/ghanizadev/bluedis/issues",
      "It is counterintuitive, but you can resize this command interface by clicking and dragging the bottom right corner.",
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
