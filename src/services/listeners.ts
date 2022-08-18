import { listen } from "@tauri-apps/api/event";
import { actions, store } from "../redux/store";
import { parseKey } from "../shared/helpers/parse-key.helper";

listen<any>("data", (event) => {
    const { payload } = event;
    const { query, isSearching } = store.getState();

    console.log({isSearching, query})


    if(!isSearching) {
        store.dispatch(actions.setSearching(true));
        store.dispatch(actions.setData([]));
    }

    store.dispatch(actions.pushData(payload.key.map(parseKey)));

    if(payload.cursor === 0){
        store.dispatch(actions.setSearching(false));
        store.dispatch(actions.setQuery({...query, cursor: 0, done: true}));
    } else {
        store.dispatch(actions.setQuery({...query, cursor: payload.cursor, done: true}));        
    }
});