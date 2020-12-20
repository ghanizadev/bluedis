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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var redis_1 = __importDefault(require("redis"));
var uuid_1 = require("uuid");
var DatabaseManager = /** @class */ (function () {
    function DatabaseManager() {
        var _this = this;
        this.deleteKey = function (key) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (res, rej) {
                        _this._instance.del(key, function (err, reply) {
                            if (err)
                                return rej(err);
                            return res(reply);
                        });
                    })];
            });
        }); };
        this.selectDatabase = function (db) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (res, rej) {
                        _this._instance.select(db, function (err, reply) {
                            if (err)
                                return rej(err);
                            return res(reply);
                        });
                    })];
            });
        }); };
    }
    DatabaseManager.prototype.connect = function (host, port, password, tls) {
        if (host === void 0) { host = "localhost"; }
        if (port === void 0) { port = 6379; }
        try {
            this._instance = redis_1["default"].createClient(port, host, {
                auth_pass: password,
                tls: tls
            });
        }
        catch (e) {
            console.log(e.message);
        }
    };
    DatabaseManager.prototype.disconnect = function () {
        this._instance.quit();
        this._instance.unref();
    };
    DatabaseManager.prototype.changeString = function (key, value) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (res, rej) {
                        _this._instance.SET(key, value, function (err) {
                            if (err)
                                rej(err);
                            return res();
                        });
                    })];
            });
        });
    };
    DatabaseManager.prototype.changeSet = function (key, value) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (res, rej) {
                        _this._instance.SADD(key, value, function (err) {
                            if (err)
                                rej(err);
                            return res();
                        });
                    })];
            });
        });
    };
    DatabaseManager.prototype.changeZSet = function (key, items) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (res, rej) {
                        _this._instance.ZADD(key, items.reduce(function (prev, curr) { return __spreadArrays(prev, [curr.score, curr.value]); }, new Array()), function (err) {
                            if (err)
                                rej(err);
                            return res();
                        });
                    })];
            });
        });
    };
    DatabaseManager.prototype.changeHash = function (key, values) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (res, rej) {
                        var items = Object.keys(values).reduce(function (prev, curr) { return __spreadArrays(prev, [curr, String(values[curr])]); }, Array());
                        _this._instance.HSET(key, items, function (err) {
                            if (err)
                                rej(err);
                            return res();
                        });
                    })];
            });
        });
    };
    DatabaseManager.prototype.changeList = function (key, value) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (res, rej) {
                        _this._instance.LPUSH(key, value, function (err) {
                            if (err)
                                rej(err);
                            return res();
                        });
                    })];
            });
        });
    };
    DatabaseManager.prototype.addListMember = function (key, value, position) {
        if (position === void 0) { position = "tail"; }
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (res, rej) {
                        if (position === "head") {
                            _this._instance.LPUSH(key, value, function (err) {
                                if (err)
                                    rej(err);
                                return res();
                            });
                        }
                        else {
                            _this._instance.RPUSH(key, value, function (err) {
                                if (err)
                                    rej(err);
                                return res();
                            });
                        }
                    })];
            });
        });
    };
    DatabaseManager.prototype.removeListMember = function (key, index) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (res, rej) {
                        var uuid = uuid_1.v4();
                        _this._instance.LSET(key, index, uuid, function (err) {
                            if (err)
                                rej(err);
                            _this._instance.LREM(key, 1, uuid, function (err) {
                                if (err)
                                    rej(err);
                                return res();
                            });
                        });
                    })];
            });
        });
    };
    DatabaseManager.prototype.alterListMember = function (key, value, index) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (res, rej) {
                        _this._instance.LSET(key, index, value, function (err) {
                            if (err)
                                rej(err);
                            res();
                        });
                    })];
            });
        });
    };
    DatabaseManager.prototype.addSetMember = function (key, value) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (res, rej) {
                        _this._instance.SADD(key, value, function (err) {
                            if (err)
                                rej(err);
                            return res();
                        });
                    })];
            });
        });
    };
    DatabaseManager.prototype.removeSetMember = function (key, value) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (res, rej) {
                        _this._instance.SREM(key, value, function (err) {
                            if (err)
                                rej(err);
                            return res();
                        });
                    })];
            });
        });
    };
    DatabaseManager.prototype.addZSetMember = function (key, value, score) {
        if (score === void 0) { score = "0"; }
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (res, rej) {
                        _this._instance.ZADD(key, [score, value], function (err) {
                            if (err)
                                rej(err);
                            return res();
                        });
                    })];
            });
        });
    };
    DatabaseManager.prototype.removeZSetMember = function (key, value) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (res, rej) {
                        _this._instance.ZREM(key, value, function (err) {
                            if (err)
                                rej(err);
                            return res();
                        });
                    })];
            });
        });
    };
    DatabaseManager.prototype.addHashMember = function (key, values) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (res, rej) {
                        var items = Object.keys(values).reduce(function (prev, curr) { return __spreadArrays(prev, [curr, String(values[curr])]); }, Array());
                        _this._instance.HSET(key, items, function (err) {
                            if (err)
                                rej(err);
                            return res();
                        });
                    })];
            });
        });
    };
    DatabaseManager.prototype.removeHashMember = function (key, value) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (res, rej) {
                        _this._instance.HDEL(key, value, function (err) {
                            if (err)
                                rej(err);
                            return res();
                        });
                    })];
            });
        });
    };
    DatabaseManager.prototype.addKey = function (key, type) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = type;
                        switch (_a) {
                            case "string": return [3 /*break*/, 1];
                            case "set": return [3 /*break*/, 3];
                            case "zset": return [3 /*break*/, 5];
                            case "hash": return [3 /*break*/, 7];
                            case "list": return [3 /*break*/, 9];
                        }
                        return [3 /*break*/, 11];
                    case 1: return [4 /*yield*/, this.changeString(key, "New Value")];
                    case 2:
                        _b.sent();
                        return [3 /*break*/, 12];
                    case 3: return [4 /*yield*/, this.changeSet(key, "New Member")];
                    case 4:
                        _b.sent();
                        return [3 /*break*/, 12];
                    case 5: return [4 /*yield*/, this.changeZSet(key, [{ score: "0", value: "New Member" }])];
                    case 6:
                        _b.sent();
                        return [3 /*break*/, 12];
                    case 7: return [4 /*yield*/, this.changeHash(key, { "New Item": "New Member" })];
                    case 8:
                        _b.sent();
                        return [3 /*break*/, 12];
                    case 9: return [4 /*yield*/, this.changeList(key, "New Member")];
                    case 10:
                        _b.sent();
                        return [3 /*break*/, 12];
                    case 11: throw new Error("not impemented");
                    case 12: return [2 /*return*/];
                }
            });
        });
    };
    DatabaseManager.prototype.hydrateItems = function (items) {
        return __awaiter(this, void 0, void 0, function () {
            var promises;
            var _this = this;
            return __generator(this, function (_a) {
                promises = items.map(function (item) { return __awaiter(_this, void 0, void 0, function () {
                    var response, type, value;
                    var _this = this;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                response = {
                                    key: item,
                                    value: "",
                                    type: ""
                                };
                                return [4 /*yield*/, new Promise(function (res, rej) {
                                        _this._instance.TYPE(item, function (err, reply) {
                                            res(reply);
                                        });
                                    })];
                            case 1:
                                type = _a.sent();
                                return [4 /*yield*/, new Promise(function (res, rej) {
                                        if (type === "string") {
                                            _this._instance.get(item, function (err, reply) {
                                                res(reply);
                                            });
                                        }
                                        else if (type === "hash") {
                                            _this._instance.hgetall(item, function (err, reply) {
                                                res(reply);
                                            });
                                        }
                                        else if (type === "set") {
                                            _this._instance.smembers(item, function (err, reply) {
                                                res(reply);
                                            });
                                        }
                                        else if (type === "list") {
                                            _this._instance.lrange(item, 0, -1, function (err, reply) {
                                                res(reply);
                                            });
                                        }
                                        else if (type === "zset") {
                                            _this._instance.zrange(item, 0, -1, "WITHSCORES", function (err, reply) {
                                                var result = [];
                                                reply.forEach(function (item, index) {
                                                    if (index % 2 === 1)
                                                        return;
                                                    result.push({
                                                        value: item,
                                                        score: reply[index + 1]
                                                    });
                                                });
                                                res(result);
                                            });
                                        }
                                    })];
                            case 2:
                                value = _a.sent();
                                response.value = value;
                                response.type = type;
                                return [2 /*return*/, response];
                        }
                    });
                }); });
                return [2 /*return*/, Promise.all(promises)];
            });
        });
    };
    DatabaseManager.prototype.find = function (match) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new Promise(function (res, rej) {
                            _this._instance.scan("0", "MATCH", match, "COUNT", "50", function (err, reply) { return __awaiter(_this, void 0, void 0, function () {
                                var cursor, items, response;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (err)
                                                rej(err);
                                            cursor = reply[0], items = reply[1];
                                            return [4 /*yield*/, this.hydrateItems(items)];
                                        case 1:
                                            response = _a.sent();
                                            res(response);
                                            return [2 /*return*/];
                                    }
                                });
                            }); });
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DatabaseManager.prototype.findAll = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new Promise(function (res, rej) {
                            _this._instance.scan("0", "COUNT", "50", function (err, reply) { return __awaiter(_this, void 0, void 0, function () {
                                var cursor, items, response;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (err)
                                                rej(err);
                                            cursor = reply[0], items = reply[1];
                                            return [4 /*yield*/, this.hydrateItems(items)];
                                        case 1:
                                            response = _a.sent();
                                            res(response);
                                            return [2 /*return*/];
                                    }
                                });
                            }); });
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return DatabaseManager;
}());
exports["default"] = DatabaseManager;
//# sourceMappingURL=index.js.map