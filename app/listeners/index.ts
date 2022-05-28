import { app, ipcMain, nativeTheme } from "electron";
import fs from "fs";
import path from "path";

import Store from "electron-store";

import DatabaseManager from "../database";
import { Manager } from "../database/manager";

const store = new Store();
const database = new DatabaseManager();
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

    database.connect(host, port, password, tls); // TODO Remove old api
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
  database.disconnect(); //TODO remove old api
  await manager.disconnect();
});

ipcMain.on("update", async (event, cursor: number) => {
  const docs = await database.find("*", cursor, 100); //TODO Remove hardcoded limit
  event.sender.send("data", docs);
});

ipcMain.on("deleteKey", async (event, key: string[]) => {
  await database.deleteKey(key);
  event.sender.send("keyRemoved", key);
});

ipcMain.on("executeCommand", async (event, command: string) => {
  try {
    console.log({ command });
    const reply = await database.command(command.replace(/\s\s+/g, " ").trim());
    event.sender.send("commandReply", reply);
  } catch (e) {
    console.log(e);
    return event.sender.send("commandReply", e.message);
  }
});

ipcMain.on("addKey", async (event, key, type, ttl) => {
  await database.addKey(key, type, ttl);

  const doc = await database.findByKeys([key]);
  event.sender.send("keyAdded", doc.pop());
});

ipcMain.on("alterString", async (event, key, value, ttl) => {
  await database.alterString(key, value, ttl);

  const doc = await database.findByKeys([key]);
  event.sender.send("dataPreview", doc.pop());
});

ipcMain.on("addListMember", async (event, key, value) => {
  await database.addListMember(key, value);

  const doc = await database.findByKeys([key]);
  event.sender.send("dataPreview", doc.pop());
});

ipcMain.on("removeListMember", async (event, key, index) => {
  await database.removeListMember(key, index);

  const doc = await database.findByKeys([key]);
  event.sender.send("dataPreview", doc.pop());
});

ipcMain.on("alterListMember", async (event, key, value, index) => {
  await database.alterListMember(key, value, index);

  const doc = await database.findByKeys([key]);
  event.sender.send("dataPreview", doc.pop());
});

ipcMain.on("addSetMember", async (event, key, value) => {
  await database.addSetMember(key, value);

  const doc = await database.findByKeys([key]);
  event.sender.send("dataPreview", doc.pop());
});

ipcMain.on("removeSetMember", async (event, key, index) => {
  await database.removeSetMember(key, index);

  const doc = await database.findByKeys([key]);
  event.sender.send("dataPreview", doc.pop());
});

ipcMain.on("addHashMember", async (event, key, value) => {
  await database.addHashMember(key, value);

  const doc = await database.findByKeys([key]);
  event.sender.send("dataPreview", doc.pop());
});

ipcMain.on("removeHashMember", async (event, key, index) => {
  await database.removeHashMember(key, index);

  const doc = await database.findByKeys([key]);
  event.sender.send("dataPreview", doc.pop());
});
ipcMain.on("addZSetMember", async (event, key, value, score) => {
  await database.addZSetMember(key, value, score);

  const doc = await database.findByKeys([key]);
  event.sender.send("dataPreview", doc.pop());
});

ipcMain.on("setTTL", async (event, key, ttl) => {
  await database.addTTL(key, ttl);

  const doc = await database.findByKeys([key]);
  event.sender.send("dataPreview", doc.pop());
});

ipcMain.on("removeTTL", async (event, key) => {
  await database.removeTTL(key);

  const doc = await database.findByKeys([key]);
  event.sender.send("dataPreview", doc.pop());
});

ipcMain.on("removeZSetMember", async (event, key, index) => {
  await database.removeZSetMember(key, index);

  const doc = await database.findByKeys([key]);
  event.sender.send("dataPreview", doc.pop());
});

ipcMain.on("selectDatabase", async (event, index) => {
  await database.selectDatabase(index);

  const docs = await database.find("*", 0, 100); //TODO Remove hardcoded limit
  event.sender.send("data", docs);
});

ipcMain.on("getCountDB", async (event) => {
  const count = await database.countDocuments();
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
  // const result = await database.find(match, cursor, 100); //TODO Remove hardcoded limit
  const result = await manager.find(match, cursor, 100);
  event.sender.send("data", result);
});

ipcMain.on("loadMore", async (event, match, cursor) => {
  const result = await database.find(match, cursor, 100); //TODO Remove hardcoded limit
  event.sender.send("loadedData", result);
});

ipcMain.on("updatePreview", async (event, key) => {
  const doc = await database.findByKeys([key]);
  event.sender.send("dataPreview", doc.pop());
});

ipcMain.on("exportItems", async (event, items) => {
  const docs = await database.findByKeys(items);
  event.sender.send("exportedItems", { docs });
});
