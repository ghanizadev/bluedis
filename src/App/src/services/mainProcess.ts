import {store, actions} from "../redux/store";
const { ipcRenderer } = window.require("electron");

export const close = () => {
  ipcRenderer.send("close");
}

export const minimize = () => {
  ipcRenderer.send("minimize");
}

export const maximize = () => {
  ipcRenderer.send("maximize");
}

export const deleteKey = (key: string | string[]) => {
  ipcRenderer.send("deleteKey", key);
}

export const updateData = (pattern: string) => {
  ipcRenderer.send("update", pattern);
}

export const addKey = (key: string, type: string) => {
  ipcRenderer.send("addKey", key, type);
}

export const changeString = (key: string, value: string) => {
  ipcRenderer.send("changeString", key, value);
}

export const addListMember = (key: string, value: string) => {
  ipcRenderer.send("addListMember", key, value);
}

export const removeListMember = (key: string, index: number) => {
  ipcRenderer.send("removeListMember", key, index);
}

export const alterListMember = (key: string, value: string, index: number) => {
  ipcRenderer.send("alterListMember", key, value, index);
}

export const addHashMember = (key: string, value: {[type: string]: any}) => {
  ipcRenderer.send("addHashMember", key, value);
}

export const alterHashMember = (key: string, value: {[type: string]: any}) => {
  ipcRenderer.send("alterHashMember", key, value);
}

export const removeHashMember = (key: string, value: string) => {
  ipcRenderer.send("removeHashMember", key, value);
}

export const addSetMember = (key: string, value: string) => {
  ipcRenderer.send("addSetMember", key, value);
}

export const removeSetMember = (key: string, value: string) => {
  ipcRenderer.send("removeSetMember", key, value);
}

export const addZSetMember = (key: string, value: string, score: string) => {
  ipcRenderer.send("addZSetMember", key, value, score);
}

export const removeZSetMember = (key: string, value: string) => {
  ipcRenderer.send("removeZSetMember", key, value);
}

export const alterZSetMember = (key: string, value: string, score: string) => {
  ipcRenderer.send("alterSetMember", key, value, score);
}

export const selectDatabase = (index: number) => {
  ipcRenderer.send("selectDatabase", index);
}

export const find = (match: string) => {
  ipcRenderer.send("find", match);
}

export const savePreferences = (preferences: any) => {
  ipcRenderer.send("savePreferences", preferences);
}

export const getPreferences = () => {
  ipcRenderer.send("getPreferences");
}

export const connect = (connection: any) => {
  ipcRenderer.send("connect", connection);
}

export const disconnect = () => {
  ipcRenderer.send("disconnect");
  store.dispatch(actions.setConnected(false));
}

ipcRenderer.on("preferences", (event: any, preferences: any) => {
  store.dispatch(actions.updatePreferences(preferences))
})

ipcRenderer.on("data", (event: any, data: any[]) => {
  const preview = store.getState().preview;

  store.dispatch(actions.setData(data));
  store.dispatch(actions.setConnected(true));
  preview && store.dispatch(actions.setPreview(data.find(item => item.key === preview.key)));
})

ipcRenderer.on("error", (event: any, error: any) => {
  alert(error);
})