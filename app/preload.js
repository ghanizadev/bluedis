import { contextBridge, shell, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld('electron', {
  receive: (event, callback) => ipcRenderer.on(event, callback),
  send: (event, ...args) => ipcRenderer.send(event, ...args),
  invoke: (event, ...args) => ipcRenderer.invoke(event, ...args),
  shell,
  platform: process.platform,
});