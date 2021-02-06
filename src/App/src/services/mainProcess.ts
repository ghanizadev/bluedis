import { store, actions } from "../redux/store";
import { Item } from "../redux/Types/Item";
const { ipcRenderer, shell } = window.require("electron");

export const close = () => {
  ipcRenderer.send("close");
};

export const minimize = () => {
  ipcRenderer.send("minimize");
};

export const maximize = () => {
  ipcRenderer.send("maximize");
};

export const deleteKey = (key: string[]) => {
  ipcRenderer.send("deleteKey", key);
};

export const updateData = () => {
  ipcRenderer.send("update");
};

export const addKey = (key: string, type: string, ttl: number | string) => {
  ipcRenderer.send("addKey", key, type, ttl);
};

export const changeString = (key: string, value: string) => {
  ipcRenderer.send("changeString", key, value);
};

export const addListMember = (key: string, value: string) => {
  ipcRenderer.send("addListMember", key, value);
};

export const removeListMember = (key: string, index: number) => {
  ipcRenderer.send("removeListMember", key, index);
};

export const alterListMember = (key: string, value: string, index: number) => {
  ipcRenderer.send("alterListMember", key, value, index);
};

export const addHashMember = (key: string, value: { [type: string]: any }) => {
  ipcRenderer.send("addHashMember", key, value);
};

export const alterHashMember = (
  key: string,
  value: { [type: string]: any }
) => {
  ipcRenderer.send("alterHashMember", key, value);
};

export const removeHashMember = (key: string, value: string) => {
  ipcRenderer.send("removeHashMember", key, value);
};

export const addSetMember = (key: string, value: string) => {
  ipcRenderer.send("addSetMember", key, value);
};

export const removeSetMember = (key: string, value: string) => {
  ipcRenderer.send("removeSetMember", key, value);
};

export const addZSetMember = (key: string, value: string, score: string) => {
  ipcRenderer.send("addZSetMember", key, value, score);
};

export const removeZSetMember = (key: string, value: string) => {
  ipcRenderer.send("removeZSetMember", key, value);
};

export const alterZSetMember = (key: string, value: string, score: string) => {
  ipcRenderer.send("alterSetMember", key, value, score);
};

export const selectDatabase = (index: number) => {
  ipcRenderer.send("selectDatabase", index);
};

export const find = (match: string, cursor?: number, count?: number) => {
  ipcRenderer.send("find", match, cursor, count);
};

export const loadMore = (match: string, cursor?: number, count?: number) => {
  ipcRenderer.send("loadMore", match, cursor, count);
};

export const findByKey = (key: string) => {
  ipcRenderer.send("findByKey", key);
};

export const updatePreview = (key: string) => {
  ipcRenderer.send("updatePreview", key);
};

export const setTTL = (key: string, ttl: number | string) => {
  ipcRenderer.send("setTTL", key, ttl);
};

export const removeTTL = (key: string) => {
  ipcRenderer.send("removeTTL", key);
};

export const savePreferences = (preferences: any) => {
  ipcRenderer.send("savePreferences", preferences);
};

export const saveFavorites = (favorites: any) => {
  ipcRenderer.send("saveFavorites", favorites);
};

export const exportItems = (items: string[]) => {
  ipcRenderer.send("exportItems", items);
};

export const wipeData = () => {
  ipcRenderer.send("wipeData");
};

export const openLink = (link: string) => {
  shell.openExternal(link);
};

export const getPreferences = () => {
  ipcRenderer.send("initial");
};

export const connect = (connection: any) => {
  store.dispatch(actions.setLoading(true));
  ipcRenderer.send("connect", connection);
};

export const disconnect = () => {
  ipcRenderer.send("disconnect");
  store.dispatch(actions.setConnected(false));
};

ipcRenderer.on("preferences", (event: any, preferences: any) => {
  preferences && store.dispatch(actions.updatePreferences(preferences));
});

ipcRenderer.on("favorites", (event: any, favorites: any) => {
  store.dispatch(actions.updateFavorites(favorites));
});

ipcRenderer.on("keyAdded", (event: any, key: Item) => {
  store.dispatch(actions.addDocument(key));
});

ipcRenderer.on("keyRemoved", (event: any, key: string[]) => {
  store.dispatch(actions.removeDocument(key));
});

ipcRenderer.on(
  "data",
  (event: any, data: { docs: Item[]; cursor: number; count: number, totalDocs: number }) => {
    store.dispatch(actions.setQuery(data));
    store.dispatch(actions.setData(data.docs));
    store.dispatch(actions.setConnected(true));
    store.dispatch(actions.setPreview(undefined));
    store.dispatch(actions.setLoading(false));
  }
);

ipcRenderer.on(
  "loadedData",
  (event: any, data: { docs: Item[]; cursor: number; count: number }) => {
    store.dispatch(
      actions.setQuery({
        cursor: data.cursor,
        count: data.count,
      })
    );

    store.dispatch(actions.pushData(data.docs));
  }
);

ipcRenderer.on("license", (event: any, license: string) => {
  store.dispatch(actions.updateLicense(license));
});

ipcRenderer.on("dataPreview", (event: any, doc: any) => {
  store.dispatch(actions.setPreview(doc));
});

ipcRenderer.on("exportedItems", (event: any, response: { docs: any[] }) => {
  const items = response.docs.reduce(
    (prev, curr) => ({ ...prev, [curr.key]: curr.value }),
    {}
  );

  const string = JSON.stringify(items, null, 2);

  const blob = new Blob([Buffer.from(string, "utf-8")], {
    type: "application/json;charset=utf-8",
  });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `export_${Date.now()}.json`;
  a.click();
});

ipcRenderer.on("error", (event: any, error: Error) => {
  if (!error || !error.message) {
    store.dispatch(
      actions.setError({ title: "Error", message: "Something went bad" })
    );
    return;
  }
  if (error.message.includes("ERR AUTH")) {
    store.dispatch(
      actions.setError({
        title: "Error",
        message: "Authentication error. Is password required?",
      })
    );
  } else if (error.message.includes("WRONGPASS")) {
    store.dispatch(
      actions.setError({ title: "Warning", message: "Password does not match" })
    );
  } else if (error.message.includes("NOAUTH")) {
    store.dispatch(
      actions.setError({
        title: "Warning",
        message: "Password is required for this connection",
      })
    );
  } else if (error.message.includes("Redis connection in broken state")) {
    store.dispatch(
      actions.setError({
        title: "Warning",
        message: "Host is unreachable. Check your connection",
      })
    );
  } else {
    store.dispatch(
      actions.setError({ title: "Error", message: error.message })
    );
  }

  store.dispatch(actions.setLoading(false));
});
