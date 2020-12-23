import { ipcMain, app } from "electron";
import DatabaseManager from "../database";
import Store from "electron-store";

const store = new Store();
const database = new DatabaseManager();

const license = `MIT License

Copyright (c) 2020 Ghanizadev Ltd.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`

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

ipcMain.on("saveFavorites", async (event, favorites) => {
  store.set("favorites", JSON.stringify(favorites));
});


ipcMain.on("wipeData", async (event, favorites) => {
  store.clear();
});

ipcMain.on("initial", async (event) => {
  const preferences = store.get("preferences");
  const favorites = store.get("favorites");

  event.sender.send("license", license);
  event.sender.send("preferences", JSON.parse(preferences as string));
  event.sender.send("favorites", JSON.parse(favorites as string));
});

ipcMain.on("find", async (event, match) => {
  const docs = await database.find(match);
  event.sender.send("data", docs);
});
