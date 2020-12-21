"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var electron_1 = require("electron");
require("./listeners");
var path_1 = __importDefault(require("path"));
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1["default"].config();
if (require("electron-squirrel-startup")) {
    electron_1.app.quit();
}
var mainWindow;
var createWindow = function () {
    mainWindow = new electron_1.BrowserWindow({
        height: 800,
        width: 1000,
        frame: false,
        transparent: true,
        icon: "assets/icon.ico",
        resizable: false,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true
        }
    });
    electron_1.globalShortcut.register("F5", function () {
        mainWindow.reload();
    });
    electron_1.globalShortcut.register("F6", function () {
        mainWindow.webContents.toggleDevTools();
    });
    if (process.env.NODE_ENV === "development") {
        mainWindow.loadURL("http://localhost:8080");
    }
    else {
        mainWindow.loadFile(path_1["default"].resolve(__dirname, "build", "index.html"));
    }
    process.on("uncaughtException", function (error) {
        mainWindow.webContents.send("error", error);
    });
};
electron_1.app.on("ready", createWindow);
electron_1.ipcMain.on("minimize", function () {
    mainWindow.minimize();
});
electron_1.ipcMain.on("maximize", function () {
    if (!mainWindow.isMaximized())
        mainWindow.maximize();
    else {
        var _a = electron_1.screen.getPrimaryDisplay().workAreaSize, width = _a.width, height = _a.height;
        mainWindow.setBounds({
            x: (width / 2) - 500,
            y: (height / 2) - 400,
            width: 1000,
            height: 800
        });
    }
});
electron_1.app.on("window-all-closed", function () {
    if (process.platform !== "darwin") {
        electron_1.app.quit();
    }
});
electron_1.app.on("will-quit", function () {
    electron_1.globalShortcut.unregisterAll();
});
electron_1.app.on("activate", function () {
    if (electron_1.BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
//# sourceMappingURL=index.js.map