import { ipcMain, app } from "electron";
import DatabaseManager from "../database";
import Store from "electron-store";

const store = new Store();

const database = new DatabaseManager();

ipcMain.on("close", () => {
  app.quit();
});

ipcMain.on("connect", async (event, options) => {
  const { host, port, password, tls } = options;

  database.connect(host, port, password, tls);
  const docs = await database.findAll();
  event.sender.send("data", docs);
})

ipcMain.on("disconnect", () => {
  database.disconnect();
})

ipcMain.on("update", async (event) => {
  const docs = await database.findAll();
  event.sender.send("data", docs);
});

ipcMain.on("deleteKey", async (event, key) => {
  await database.deleteKey(key);

  const docs = await database.findAll();
  event.sender.send("data", docs);
});

ipcMain.on("addKey", async (event, key, type) => {
  await database.addKey(key, type);

  const docs = await database.findAll();
  event.sender.send("data", docs);
});

ipcMain.on("changeString", async (event, key, value) => {
  await database.changeString(key, value);

  const docs = await database.findAll();
  event.sender.send("data", docs);
});

ipcMain.on("addListMember", async (event, key, value) => {
  await database.addListMember(key, value);

  const docs = await database.findAll();
  event.sender.send("data", docs);
});

ipcMain.on("removeListMember", async (event, key, index) => {
  await database.removeListMember(key, index);

  const docs = await database.findAll();
  event.sender.send("data", docs);
});

ipcMain.on("alterListMember", async (event, key, value, index) => {
  await database.alterListMember(key, value, index);

  const docs = await database.findAll();
  event.sender.send("data", docs);
});

ipcMain.on("addSetMember", async (event, key, value) => {
  await database.addSetMember(key, value);

  const docs = await database.findAll();
  event.sender.send("data", docs);
});

ipcMain.on("removeSetMember", async (event, key, index) => {
  await database.removeSetMember(key, index);

  const docs = await database.findAll();
  event.sender.send("data", docs);
});

ipcMain.on("addHashMember", async (event, key, value) => {
  await database.addHashMember(key, value);

  const docs = await database.findAll();
  event.sender.send("data", docs);
});

ipcMain.on("removeHashMember", async (event, key, index) => {
  await database.removeHashMember(key, index);

  const docs = await database.findAll();
  event.sender.send("data", docs);
});
ipcMain.on("addZSetMember", async (event, key, value, score) => {
  await database.addZSetMember(key, value, score);

  const docs = await database.findAll();
  event.sender.send("data", docs);
});

ipcMain.on("removeZSetMember", async (event, key, index) => {
  await database.removeZSetMember(key, index);

  const docs = await database.findAll();
  event.sender.send("data", docs);
});

ipcMain.on("selectDatabase", async (event, index) => {
  await database.selectDatabase(index);

  const docs = await database.findAll();
  event.sender.send("data", docs);
});

ipcMain.on("savePreferences", async (event, preferences) => {
  store.set("preferences", JSON.stringify(preferences));
});

ipcMain.on("getPreferences", async (event) => {
  const preferences = store.get("preferences");
  event.sender.send("preferences", JSON.parse(preferences as string));
});

ipcMain.on("find", async (event, match) => {
  const docs = await database.find(match);
  event.sender.send("data", docs);
});
