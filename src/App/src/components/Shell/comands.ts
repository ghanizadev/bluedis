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
      "List of available commands: (excluding Redis interface)",
      "\u00a0",
      "  - help: Open this help menu;",
      "  - clear: Clear the terminal;",
      "  - refresh: Update the current list;",
      "  - exit: Close the terminal;",
    ].forEach((line) => store.dispatch(actions.updateSTDOUT(line)));
  },
};
