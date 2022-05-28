import { app, ipcMain, nativeTheme } from "electron";
import fs from "fs";
import path from "path";

import Store from "electron-store";

import { Manager } from "../database/manager";

const store = new Store();
const manager = new Manager();

const license = fs
  .readFileSync(path.resolve(__dirname, "..", "..", "LICENSE.txt"))
  .toString("utf-8");

ipcMain.on("close", () => {
  app.quit();
});

ipcMain.on("connect", async (event, options) => {
  try {
    const { host, port, password, tls } = options;

    await manager.connect(
      `redis${tls ? "s" : ""}://${
        password ? `:${password}@` : ""
      }${host}:${port}`
    );

    const docs = await manager.find("*", 0, 100);
    event.sender.send("data", docs);
  } catch (e) {
    return event.sender.send("error", e);
  }
});

ipcMain.on("disconnect", async () => {
  await manager.disconnect();
});

ipcMain.on("update", async (event, query: any) => {
  const docs = await manager.find(query.input ?? "*", query.cursor, 100); //TODO Remove hardcoded limit
  event.sender.send("data", docs);
});

ipcMain.on("remove", async (event, key: string[]) => {
  await manager.remove(key);
  event.sender.send("keyRemoved", key);
});

ipcMain.on("execute", async (event, command: string) => {
  try {
    const reply = await manager.command(command.replace(/\s\s+/g, " ").trim());
    event.sender.send("commandReply", reply);
  } catch (e) {
    console.log(e);
    return event.sender.send("commandReply", e.message);
  }
});

ipcMain.on("add", async (event, key, type, ttl, ttlAbsolute) => {
  const doc = await manager.createKey(key, type);

  if (ttl > 0) await manager.setTTL(key, ttl, ttlAbsolute);

  event.sender.send("keyAdded", doc);
});

ipcMain.on("alter", async (event, key, value, update) => {
  const doc = await manager.setKey(key, value, update);
  event.sender.send("dataPreview", doc);
});

ipcMain.on("del", async (event, key, indexOrName: string) => {
  const doc = await manager.remKey(key, indexOrName);
  event.sender.send("dataPreview", doc);
});

ipcMain.on("setTTL", async (event, key, ttl, absoluteTTl) => {
  await manager.setTTL(key, ttl, absoluteTTl);
  const doc = await manager.getKey(key);
  event.sender.send("dataPreview", doc);
});

ipcMain.on("selectDatabase", async (event, index) => {
  await manager.selectDB(index);

  const docs = await manager.find("*", 0, 100); //TODO Remove hardcoded limit
  event.sender.send("data", docs);
});

ipcMain.on("getCountDB", async (event) => {
  const count = await manager.count();
  event.sender.send("setCountDB", count);
});

ipcMain.on("savePreferences", async (event, preferences) => {
  store.set("preferences", JSON.stringify(preferences));
});

ipcMain.on("saveFavorites", async (event, favorites) => {
  store.set("favorites", JSON.stringify(favorites));
});

ipcMain.on("wipeData", async (event) => {
  store.clear();
  event.sender.send("preferences", {
    appearance: {
      systemTheme: nativeTheme.shouldUseDarkColors ? "dark" : "light",
    },
  });
  event.sender.send("favorites", []);
});

ipcMain.on("initial", async (event) => {
  const preferences = store.get("preferences");
  const favorites = store.get("favorites");

  event.sender.send("license", license);

  let pref: any = {
    appearance: {
      systemTheme: nativeTheme.shouldUseDarkColors ? "dark" : "light",
    },
  };

  if (preferences) {
    const saved = JSON.parse(preferences as string);
    pref = {
      ...saved,
      appearance: { ...saved.appearance, ...pref.appearance },
    };
  }

  event.sender.send("preferences", pref);

  if (favorites)
    event.sender.send("favorites", JSON.parse(favorites as string));
});

ipcMain.on("find", async (event, match: string, cursor: number) => {
  const result = await manager.find(match, cursor, 100);
  event.sender.send("data", result);
});

ipcMain.on("loadMore", async (event, match, cursor) => {
  const result = await manager.find(match, cursor, 100); //TODO Remove hardcoded limit
  event.sender.send("loadedData", result);
});

ipcMain.on("updatePreview", async (event, key) => {
  const doc = await manager.getKey(key);
  event.sender.send("dataPreview", doc);
});

ipcMain.on("exportItems", async (event, items) => {
  const response = await Promise.all(items.map(manager.getKey.bind(manager)));
  const docs = response.reduce(
    (prev, curr) => ({ ...prev, [curr.key]: curr.value }),
    {}
  );

  const string = JSON.stringify(docs, null, 2);
  event.sender.send("exportedItems", Buffer.from(string, "utf-8"));
});
