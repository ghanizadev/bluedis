import { listen } from "@tauri-apps/api/event";
import { actions, store } from "../redux/store";
import { parseKey } from "../shared/helpers/parse-key.helper";

listen<any>("data", (event) => {
    const { payload } = event;
    const { query } = store.getState();

    store.dispatch(actions.pushData(payload.key.map(parseKey)));
    store.dispatch(actions.setQuery({ ...query, cursor: payload.cursor, done: payload.cursor === 0 }));
});