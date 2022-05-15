"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var electron_1 = require("electron");
var database_1 = __importDefault(require("../database"));
var electron_store_1 = __importDefault(require("electron-store"));
var store = new electron_store_1["default"]();
var database = new database_1["default"]();
var license = "MIT License\n\nCopyright (c) 2020 Ghanizadev Ltd.\n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the \"Software\"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\nSOFTWARE.";
electron_1.ipcMain.on("close", function () {
    electron_1.app.quit();
});
electron_1.ipcMain.on("connect", function (event, options) { return __awaiter(void 0, void 0, void 0, function () {
    var host, port, password, tls, docs, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                host = options.host, port = options.port, password = options.password, tls = options.tls;
                database.connect(host, port, password, tls);
                return [4 /*yield*/, database.findAll()];
            case 1:
                docs = _a.sent();
                event.sender.send("data", docs);
                return [3 /*break*/, 3];
            case 2:
                e_1 = _a.sent();
                return [2 /*return*/, event.sender.send("error", e_1)];
            case 3: return [2 /*return*/];
        }
    });
}); });
electron_1.ipcMain.on("disconnect", function () {
    database.disconnect();
});
electron_1.ipcMain.on("update", function (event) { return __awaiter(void 0, void 0, void 0, function () {
    var docs;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, database.findAll()];
            case 1:
                docs = _a.sent();
                event.sender.send("data", docs);
                return [2 /*return*/];
        }
    });
}); });
electron_1.ipcMain.on("deleteKey", function (event, key) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, database.deleteKey(key)];
            case 1:
                _a.sent();
                event.sender.send("keyRemoved", key);
                return [2 /*return*/];
        }
    });
}); });
electron_1.ipcMain.on("executeCommand", function (event, command) { return __awaiter(void 0, void 0, void 0, function () {
    var reply, e_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                console.log({ command: command });
                return [4 /*yield*/, database.command(command.replace(/\s\s+/g, " ").trim())];
            case 1:
                reply = _a.sent();
                event.sender.send("commandReply", reply);
                return [3 /*break*/, 3];
            case 2:
                e_2 = _a.sent();
                console.log(e_2);
                return [2 /*return*/, event.sender.send("commandReply", e_2.message)];
            case 3: return [2 /*return*/];
        }
    });
}); });
electron_1.ipcMain.on("addKey", function (event, key, type, ttl) { return __awaiter(void 0, void 0, void 0, function () {
    var doc;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, database.addKey(key, type, ttl)];
            case 1:
                _a.sent();
                return [4 /*yield*/, database.findByKeys([key])];
            case 2:
                doc = _a.sent();
                event.sender.send("keyAdded", doc.pop());
                return [2 /*return*/];
        }
    });
}); });
electron_1.ipcMain.on("changeString", function (event, key, value, ttl) { return __awaiter(void 0, void 0, void 0, function () {
    var doc;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, database.changeString(key, value, ttl)];
            case 1:
                _a.sent();
                return [4 /*yield*/, database.findByKeys([key])];
            case 2:
                doc = _a.sent();
                event.sender.send("dataPreview", doc.pop());
                return [2 /*return*/];
        }
    });
}); });
electron_1.ipcMain.on("addListMember", function (event, key, value) { return __awaiter(void 0, void 0, void 0, function () {
    var doc;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, database.addListMember(key, value)];
            case 1:
                _a.sent();
                return [4 /*yield*/, database.findByKeys([key])];
            case 2:
                doc = _a.sent();
                event.sender.send("dataPreview", doc.pop());
                return [2 /*return*/];
        }
    });
}); });
electron_1.ipcMain.on("removeListMember", function (event, key, index) { return __awaiter(void 0, void 0, void 0, function () {
    var doc;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, database.removeListMember(key, index)];
            case 1:
                _a.sent();
                return [4 /*yield*/, database.findByKeys([key])];
            case 2:
                doc = _a.sent();
                event.sender.send("dataPreview", doc.pop());
                return [2 /*return*/];
        }
    });
}); });
electron_1.ipcMain.on("alterListMember", function (event, key, value, index) { return __awaiter(void 0, void 0, void 0, function () {
    var doc;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, database.alterListMember(key, value, index)];
            case 1:
                _a.sent();
                return [4 /*yield*/, database.findByKeys([key])];
            case 2:
                doc = _a.sent();
                event.sender.send("dataPreview", doc.pop());
                return [2 /*return*/];
        }
    });
}); });
electron_1.ipcMain.on("addSetMember", function (event, key, value) { return __awaiter(void 0, void 0, void 0, function () {
    var doc;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, database.addSetMember(key, value)];
            case 1:
                _a.sent();
                return [4 /*yield*/, database.findByKeys([key])];
            case 2:
                doc = _a.sent();
                event.sender.send("dataPreview", doc.pop());
                return [2 /*return*/];
        }
    });
}); });
electron_1.ipcMain.on("removeSetMember", function (event, key, index) { return __awaiter(void 0, void 0, void 0, function () {
    var doc;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, database.removeSetMember(key, index)];
            case 1:
                _a.sent();
                return [4 /*yield*/, database.findByKeys([key])];
            case 2:
                doc = _a.sent();
                event.sender.send("dataPreview", doc.pop());
                return [2 /*return*/];
        }
    });
}); });
electron_1.ipcMain.on("addHashMember", function (event, key, value) { return __awaiter(void 0, void 0, void 0, function () {
    var doc;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, database.addHashMember(key, value)];
            case 1:
                _a.sent();
                return [4 /*yield*/, database.findByKeys([key])];
            case 2:
                doc = _a.sent();
                event.sender.send("dataPreview", doc.pop());
                return [2 /*return*/];
        }
    });
}); });
electron_1.ipcMain.on("removeHashMember", function (event, key, index) { return __awaiter(void 0, void 0, void 0, function () {
    var doc;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, database.removeHashMember(key, index)];
            case 1:
                _a.sent();
                return [4 /*yield*/, database.findByKeys([key])];
            case 2:
                doc = _a.sent();
                event.sender.send("dataPreview", doc.pop());
                return [2 /*return*/];
        }
    });
}); });
electron_1.ipcMain.on("addZSetMember", function (event, key, value, score) { return __awaiter(void 0, void 0, void 0, function () {
    var doc;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, database.addZSetMember(key, value, score)];
            case 1:
                _a.sent();
                return [4 /*yield*/, database.findByKeys([key])];
            case 2:
                doc = _a.sent();
                event.sender.send("dataPreview", doc.pop());
                return [2 /*return*/];
        }
    });
}); });
electron_1.ipcMain.on("setTTL", function (event, key, ttl) { return __awaiter(void 0, void 0, void 0, function () {
    var doc;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, database.addTTL(key, ttl)];
            case 1:
                _a.sent();
                return [4 /*yield*/, database.findByKeys([key])];
            case 2:
                doc = _a.sent();
                event.sender.send("dataPreview", doc.pop());
                return [2 /*return*/];
        }
    });
}); });
electron_1.ipcMain.on("removeTTL", function (event, key) { return __awaiter(void 0, void 0, void 0, function () {
    var doc;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, database.removeTTL(key)];
            case 1:
                _a.sent();
                return [4 /*yield*/, database.findByKeys([key])];
            case 2:
                doc = _a.sent();
                event.sender.send("dataPreview", doc.pop());
                return [2 /*return*/];
        }
    });
}); });
electron_1.ipcMain.on("removeZSetMember", function (event, key, index) { return __awaiter(void 0, void 0, void 0, function () {
    var doc;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, database.removeZSetMember(key, index)];
            case 1:
                _a.sent();
                return [4 /*yield*/, database.findByKeys([key])];
            case 2:
                doc = _a.sent();
                event.sender.send("dataPreview", doc.pop());
                return [2 /*return*/];
        }
    });
}); });
electron_1.ipcMain.on("selectDatabase", function (event, index) { return __awaiter(void 0, void 0, void 0, function () {
    var docs;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, database.selectDatabase(index)];
            case 1:
                _a.sent();
                return [4 /*yield*/, database.findAll()];
            case 2:
                docs = _a.sent();
                event.sender.send("data", docs);
                return [2 /*return*/];
        }
    });
}); });
electron_1.ipcMain.on("savePreferences", function (event, preferences) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        store.set("preferences", JSON.stringify(preferences));
        return [2 /*return*/];
    });
}); });
electron_1.ipcMain.on("saveFavorites", function (event, favorites) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        store.set("favorites", JSON.stringify(favorites));
        return [2 /*return*/];
    });
}); });
electron_1.ipcMain.on("wipeData", function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        store.clear();
        return [2 /*return*/];
    });
}); });
electron_1.ipcMain.on("initial", function (event) { return __awaiter(void 0, void 0, void 0, function () {
    var preferences, favorites;
    return __generator(this, function (_a) {
        preferences = store.get("preferences");
        favorites = store.get("favorites");
        event.sender.send("license", license);
        if (preferences)
            event.sender.send("preferences", JSON.parse(preferences));
        if (favorites)
            event.sender.send("favorites", JSON.parse(favorites));
        return [2 /*return*/];
    });
}); });
electron_1.ipcMain.on("find", function (event, match) { return __awaiter(void 0, void 0, void 0, function () {
    var result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, database.findByName(match)];
            case 1:
                result = _a.sent();
                event.sender.send("data", result);
                return [2 /*return*/];
        }
    });
}); });
electron_1.ipcMain.on("loadMore", function (event, match, cursor) { return __awaiter(void 0, void 0, void 0, function () {
    var result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, database.loadMore(match, cursor || 0)];
            case 1:
                result = _a.sent();
                event.sender.send("loadedData", result);
                return [2 /*return*/];
        }
    });
}); });
electron_1.ipcMain.on("updatePreview", function (event, key) { return __awaiter(void 0, void 0, void 0, function () {
    var doc;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, database.findByKeys([key])];
            case 1:
                doc = _a.sent();
                event.sender.send("dataPreview", doc.pop());
                return [2 /*return*/];
        }
    });
}); });
electron_1.ipcMain.on("exportItems", function (event, items) { return __awaiter(void 0, void 0, void 0, function () {
    var docs;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, database.findByKeys(items)];
            case 1:
                docs = _a.sent();
                event.sender.send("exportedItems", { docs: docs });
                return [2 /*return*/];
        }
    });
}); });
//# sourceMappingURL=index.js.map