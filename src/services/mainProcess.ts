/* eslint-disable  @typescript-eslint/no-explicit-any */

import { store, actions } from "../redux/store";
import { Item } from "../redux/Types/Item";
import {DarkTheme, defaultAppearanceSettings, LightTheme} from "../theme";
import {Query} from "../redux/Types/Query";
import services from "./services";

export const close = () => {
  services.send("close");
};

export const minimize = () => {
  services.send("minimize");
};

export const maximize = () => {
  services.send("maximize");
};

export const fullscreen = () => {
  services.send("fullscreen");
};

export const deleteKey = (key: string[]) => {
  services.send("deleteKey", key);
};

export const updateData = () => {
  const cursor = store.getState().query.cursor;
  services.send("update", cursor);
};

export const getDBCount = () => {
  services.send("getCountDB");
};

export const addKey = (key: string, type: string, ttl: number | string) => {
  services.send("addKey", key, type, ttl);
};

export const changeString = (key: string, value: string) => {
  services.send("changeString", key, value);
};

export const addListMember = (key: string, value: string) => {
  services.send("addListMember", key, value);
};

export const removeListMember = (key: string, index: number) => {
  services.send("removeListMember", key, index);
};

export const alterListMember = (key: string, value: string, index: number) => {
  services.send("alterListMember", key, value, index);
};

export const addHashMember = (key: string, value: { [type: string]: any }) => {
  services.send("addHashMember", key, value);
};

export const alterHashMember = (
  key: string,
  value: { [type: string]: any }
) => {
  services.send("alterHashMember", key, value);
};

export const removeHashMember = (key: string, value: string) => {
  services.send("removeHashMember", key, value);
};

export const addSetMember = (key: string, value: string) => {
  services.send("addSetMember", key, value);
};

export const removeSetMember = (key: string, value: string) => {
  services.send("removeSetMember", key, value);
};

export const addZSetMember = (key: string, value: string, score: string) => {
  services.send("addZSetMember", key, value, score);
};

export const removeZSetMember = (key: string, value: string) => {
  services.send("removeZSetMember", key, value);
};

export const alterZSetMember = (key: string, value: string, score: string) => {
  services.send("alterSetMember", key, value, score);
};

export const selectDatabase = (index: number) => {
  services.send("selectDatabase", index);
};

export const find = (match: string, cursor: number) => {
  services.send("find", match, cursor);
};

export const loadMore = (match: string, cursor: number) => {
  services.send("loadMore", match, cursor);
};

export const findByKey = (key: string) => {
  services.send("findByKey", key);
};

export const updatePreview = (key: string) => {
  services.send("updatePreview", key);
};

export const setTTL = (key: string, ttl: number | string) => {
  services.send("setTTL", key, ttl);
};

export const removeTTL = (key: string) => {
  services.send("removeTTL", key);
};

export const savePreferences = (preferences: any) => {
  services.send("savePreferences", preferences);
};

export const saveFavorites = (favorites: any) => {
  services.send("saveFavorites", favorites);
};

export const executeCommand = (command: string) => {
  services.send("executeCommand", command);
};

export const exportItems = (items: string[]) => {
  services.send("exportItems", items);
};

export const wipeData = () => {
  services.send("wipeData");
};

export const openLink = (link: string) => {
  services.shell.openExternal(link);
};

export const getPreferences = () => {
  services.send("initial");
};

export const connect = (connection: any) => {
  store.dispatch(actions.setLoading(true));
  services.send("connect", connection);
};

export const disconnect = () => {
  services.send("disconnect");
  store.dispatch(actions.setConnected(false));
  store.dispatch(actions.resetTerminal());
};

services.receive("preferences", (event: any, preferences: any) => {
  const darkTheme = typeof preferences.appearance.darkTheme !== 'undefined'
    ? preferences.appearance.darkTheme
    : preferences.appearance.systemTheme === 'dark';
  
  preferences && store.dispatch(actions.updatePreferences({
    ...preferences,
    appearance: {
      ...defaultAppearanceSettings,
      ...preferences.appearance,
      ...(darkTheme ? DarkTheme : LightTheme),
      darkTheme,
    }
  }));
});

services.receive("setCountDB", (event: any, count: number) => {
  store.dispatch(actions.setCount(count));
});

services.receive("favorites", (event: any, favorites: any) => {
  store.dispatch(actions.updateFavorites(favorites));
});

services.receive("keyAdded", (event: any, key: Item) => {
  store.dispatch(actions.addDocument(key));
});

services.receive("keyRemoved", (event: any, key: string[]) => {
  store.dispatch(actions.removeDocument(key));
});

services.receive("data", (event: any, data: { docs: Item[]; } & Query) => {
    store.dispatch(actions.setQuery(data));
    store.dispatch(actions.setData(data.docs));
    store.dispatch(actions.setConnected(true));
    store.dispatch(actions.setPreview(undefined));
    store.dispatch(actions.setLoading(false));
  }
);

services.receive("loadedData", (event: any, data: { docs: Item[]; } & Query ) => {
    store.dispatch(actions.setQuery(data));
    store.dispatch(actions.pushData(data.docs));
  }
);

services.receive("license", (event: any, license: string) => {
  store.dispatch(actions.updateLicense(license));
});

services.receive("commandReply", (event: any, reply: string) => {
  store.dispatch(actions.updateSTDOUT(reply));
});

services.receive("dataPreview", (event: any, doc: any) => {
  store.dispatch(actions.setPreview(doc));
});

services.receive("exportedItems", (event: any, response: { docs: any[] }) => {
  console.log({ response })
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

services.receive("error", (event: any, error: Error) => {
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
