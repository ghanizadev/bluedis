import { app, BrowserWindow, globalShortcut, ipcMain, screen, nativeImage } from "electron";
import path from "path";
import dotenv from "dotenv";

import "./listeners";
import {platform} from "os";

dotenv.config({ path: '../' });
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

if (require("electron-squirrel-startup")) {
    app.quit();
}

let mainWindow: BrowserWindow;

const icon = (function() {
  const ext = process.platform === 'darwin'
    ? "icns"
    : process.platform === 'linux'
    ? "png"
    : "ico"
  
  const iconPath = path.resolve(app.getAppPath(), 'assets', 'icon.' + ext);
  return nativeImage.createFromPath(iconPath);
})();

process.platform === 'darwin' && app.dock.setIcon(icon);

const createWindow = async (): Promise<void> => {
    mainWindow = new BrowserWindow({
        height: 800,
        width: 1200,
        frame: false,
        transparent: true,
        icon,
        resizable: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

  globalShortcut.register("F5", () => {
        process.env.NODE_ENV === "development" && mainWindow.reload();
    });

    globalShortcut.register("F6", () => {
        process.env.NODE_ENV === "development" &&
        mainWindow.webContents.toggleDevTools();
    });

    if (process.env.NODE_ENV === "development") {
        mainWindow.loadURL("http://localhost:3000");
    } else {
        mainWindow.loadFile(path.resolve(__dirname, "app", "index.html"));
    }

    process.on("uncaughtException", (error) => {
        mainWindow.webContents.send("error", error);
    });
};

app.on("ready", createWindow);

ipcMain.on("minimize", () => {
    mainWindow.minimize();
});

ipcMain.on("maximize", () => {
    if (!mainWindow.isMaximized()) mainWindow.maximize();
    else {
        const { width, height } = screen.getPrimaryDisplay().workAreaSize;

        mainWindow.setBounds({
            x: width / 2 - 500,
            y: height / 2 - 400,
            width: 1000,
            height: 800,
        });
    }
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("will-quit", () => {
    globalShortcut.unregisterAll();
});

app.on("activate", async () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        await createWindow();
    }
});
