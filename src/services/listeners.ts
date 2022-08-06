/* eslint-disable  @typescript-eslint/no-explicit-any */

import { actions, store } from "../redux/store";
import { DarkTheme, defaultAppearanceSettings, LightTheme } from "../theme";
import { ItemType } from "../redux/Types/Item";
import { Query } from "../redux/Types/Query";

import services from "./services";

services.receive("preferences", (event: any, preferences: any) => {
  const darkTheme =
    typeof preferences.appearance.darkTheme !== "undefined"
      ? preferences.appearance.darkTheme
      : preferences.appearance.systemTheme === "dark";

  preferences &&
    store.dispatch(
      actions.updatePreferences({
        ...preferences,
        appearance: {
          ...defaultAppearanceSettings,
          ...preferences.appearance,
          ...(darkTheme ? DarkTheme : LightTheme),
          darkTheme,
        },
      })
    );
});

services.receive("setCountDB", (event: any, count: number) => {
  store.dispatch(actions.setCount(count));
});

services.receive("favorites", (event: any, favorites: any) => {
  store.dispatch(actions.updateFavorites(favorites));
});

services.receive("keyAdded", (event: any, key: ItemType) => {
  store.dispatch(actions.addDocument(key));
});

services.receive("keyRemoved", (event: any, key: string[]) => {
  store.dispatch(actions.removeDocument(key));
});

services.receive("data", (event: any, data: { docs: ItemType[] } & Query) => {
  store.dispatch(actions.setQuery(data));
  store.dispatch(actions.setData(data.docs));
  store.dispatch(actions.setConnected(true));
  store.dispatch(actions.setPreview(undefined));
  store.dispatch(actions.setLoading(false));
});

services.receive(
  "pushData",
  (event: any, data: { docs: ItemType[] } & Query) => {
    store.dispatch(actions.setQuery(data));
    store.dispatch(actions.pushData(data.docs));
  }
);

services.receive("searchFinish", (event: any) => {
  store.dispatch(actions.setSearching(false));
});

services.receive(
  "loadedData",
  (event: any, data: { docs: ItemType[] } & Query) => {
    store.dispatch(actions.setQuery(data));
    store.dispatch(actions.pushData(data.docs));
  }
);

services.receive("license", (event: any, license: string) => {
  store.dispatch(actions.updateLicense(license));
});

services.receive("commandReply", (event: any, reply: string[]) => {
  store.dispatch(actions.updateSTDOUT(reply));
});

services.receive("dataPreview", (event: any, doc: any) => {
  store.dispatch(actions.setPreview(doc));
});

services.receive("exportedItems", (event: any, ...parts: any[]) => {
  const blob = new Blob(parts, {
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
