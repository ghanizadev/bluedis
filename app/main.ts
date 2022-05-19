import { app, BrowserWindow, globalShortcut, ipcMain, screen, nativeImage } from "electron";
import path from "path";
import dotenv from "dotenv";

import "./listeners";

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

const HEIGHT = 800;
const WIDTH = 1200;

const createWindow = async (): Promise<void> => {
    mainWindow = new BrowserWindow({
        height: HEIGHT,
        width: WIDTH,
        minHeight: HEIGHT,
        minWidth: WIDTH,
        frame: false,
        transparent: true,
        icon,
        webPreferences: {
          preload: path.resolve(__dirname, 'preload.js'),
          nodeIntegration: true,
          contextIsolation: true,
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
            x: width / 2 - (WIDTH / 2),
            y: height / 2 - (HEIGHT / 2),
            width: WIDTH,
            height: HEIGHT,
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
