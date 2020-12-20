import { app, BrowserWindow, globalShortcut, ipcMain } from "electron";
import "./listeners";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

declare const MAIN_WINDOW_WEBPACK_ENTRY: any;

if (require("electron-squirrel-startup")) {
  app.quit();
}

let mainWindow: BrowserWindow;

const createWindow = (): void => {
  mainWindow = new BrowserWindow({
    height: 800,
    width: 1000,
    frame: false,
    transparent: true,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      preload: MAIN_WINDOW_WEBPACK_ENTRY
    },
  });

  globalShortcut.register("F5", () => {
    mainWindow.reload();
  });

  globalShortcut.register("F6", () => {
    mainWindow.webContents.toggleDevTools();
  });

  console.log(process.env.NODE_ENV)
  if(process.env.NODE_ENV === "development") {
    mainWindow.loadURL("http://localhost:8080");
  } else {
    mainWindow.loadFile(path.resolve(__dirname, "src", "App", "build", "index.html"));
  }
};

app.on("ready", createWindow);

ipcMain.on("minimize", () => {
  mainWindow.minimize();
});

ipcMain.on("maximize", () => {
  mainWindow.maximize();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("will-quit", () => {
  globalShortcut.unregisterAll();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

process.on("uncaughtException", (error) => {
  mainWindow.webContents.send("error", error)
})
