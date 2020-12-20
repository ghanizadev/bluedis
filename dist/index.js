"use strict";
exports.__esModule = true;
var electron_1 = require("electron");
require("./listeners");
if (require("electron-squirrel-startup")) {
    // eslint-disable-line global-require
    electron_1.app.quit();
}
var mainWindow;
var createWindow = function () {
    mainWindow = new electron_1.BrowserWindow({
        height: 800,
        width: 1000,
        frame: false,
        transparent: true,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
            preload: MAIN_WINDOW_WEBPACK_ENTRY
        }
    });
    electron_1.globalShortcut.register("F5", function () {
        mainWindow.reload();
    });
    electron_1.globalShortcut.register("F6", function () {
        mainWindow.webContents.toggleDevTools();
    });
    mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
    // mainWindow.loadURL("http://localhost:8080");
    // const entry = path.resolve(__dirname, "App", "build", "index.html");
    // mainWindow.loadFile(entry);
    // console.log(entry)
    // database.findAll()
    // .then(docs => {
    //   mainWindow.webContents.send("data", docs);
    // });
};
electron_1.app.on("ready", createWindow);
electron_1.ipcMain.on("minimize", function () {
    mainWindow.minimize();
});
electron_1.ipcMain.on("maximize", function () {
    mainWindow.maximize();
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
process.on("uncaughtException", function (error) {
    mainWindow.webContents.send("error", error);
});
//# sourceMappingURL=index.js.map