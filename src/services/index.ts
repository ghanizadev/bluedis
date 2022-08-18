import { invoke } from "@tauri-apps/api";
import { actions, store } from "../redux/store";
import { Query } from "../redux/Types/Query";
import { parseConnectionString } from "../shared/helpers/parse-connection-string.helper";
import { parseKey } from "../shared/helpers/parse-key.helper";
import { FindKeyResponse } from "./find-key-response.interface";

const getConnectionConfig = () => {
  let state = store.getState();
  return parseConnectionString(state.connection!);
}

const findKeys = async (query?: Query) => {
  let state = store.getState();

  let { input, cursor } = query ?? state.query;
  let cstr = parseConnectionString(state.connection!);

  const data = await invoke<FindKeyResponse>("find_keys", {
    cstr,
    pattern: input,
    cursor,
  });
  const count = await invoke<{ Error?: string; Count?: number }>("db_count", {
    cstr,
  });

  if (data.Error || count.Error) {
    store.dispatch(actions.setLoading(false));
    store.dispatch(
      actions.setError({
        title: "Error",
        message: data.Error ?? count.Error ?? "Failed to fetch keys",
      })
    );

    return;
  }

  const { keys, cursor: newCursor } = data.Response!.Collection;
  store.dispatch(actions.setData(keys.map(parseKey)));

  store.dispatch(actions.setConnected(true));
  store.dispatch(actions.setLoading(false));
  store.dispatch(
    actions.setQuery({
      input,
      cursor: newCursor,
      done: newCursor === 0,
      count: count.Count ?? keys.length,
    })
  );
}

export default {
  getConnectionConfig,
  findKeys,
}
