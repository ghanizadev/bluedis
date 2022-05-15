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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var ioredis_1 = __importDefault(require("ioredis"));
var uuid_1 = require("uuid");
var availableCommands_json_1 = __importDefault(require("./availableCommands.json"));
var DatabaseManager = /** @class */ (function () {
    function DatabaseManager() {
        var _this = this;
        this.command = function (command) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (res, rej) {
                        var _a;
                        try {
                            var c = availableCommands_json_1["default"].find(function (str) {
                                return command.toLowerCase().startsWith(str);
                            });
                            if (!c)
                                return rej("Command not found");
                            (_a = _this._instance)
                                .call.apply(_a, __spreadArray([c], command
                                .slice(c.length)
                                .trim()
                                .split(" ")
                                .filter(function (i) { return i !== ""; }), false)).then(function (reply) {
                                return res(reply);
                            })["catch"](function (e) {
                                return rej(e);
                            });
                            return _this._instance;
                        }
                        catch (e) {
                            console.error(e);
                        }
                    })];
            });
        }); };
        this.deleteKey = function (key) { return __awaiter(_this, void 0, void 0, function () {
            var args;
            return __generator(this, function (_a) {
                args = Array.isArray(key) ? key : [key];
                return [2 /*return*/, this._instance.del(args)];
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
        if (tls === void 0) { tls = false; }
        this._instance = new ioredis_1["default"]("redis".concat(tls ? 's' : '', "://:").concat(password, "@").concat(host, ":").concat(port), {
            retryStrategy: function (times) {
                if (times > 3)
                    throw new Error("timeout");
            },
            maxRetriesPerRequest: 3
        });
    };
    DatabaseManager.prototype.disconnect = function () {
        this._instance.quit();
    };
    DatabaseManager.prototype.addTTL = function (key, ttl) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (res, rej) {
                        if (ttl) {
                            if (typeof ttl === "string") {
                                _this._instance.pexpireat(key, new Date(ttl).getTime(), function (err) {
                                    if (err)
                                        rej(err);
                                    else
                                        res();
                                });
                            }
                            else {
                                _this._instance.expire(key, ttl, function (err) {
                                    if (err)
                                        rej(err);
                                    else
                                        res();
                                });
                            }
                        }
                        else
                            res();
                    })];
            });
        });
    };
    DatabaseManager.prototype.removeTTL = function (key) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (res, rej) {
                        _this._instance.persist(key, function (err) {
                            if (err)
                                rej(err);
                            else
                                res();
                        });
                    })];
            });
        });
    };
    DatabaseManager.prototype.changeString = function (key, value, ttl) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (res, rej) {
                        _this._instance.set(key, value, function (err) {
                            if (err)
                                rej(err);
                            else
                                _this.addTTL(key, ttl).then(res);
                        });
                    })];
            });
        });
    };
    DatabaseManager.prototype.changeSet = function (key, value, ttl) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (res, rej) {
                        _this._instance.sadd(key, value, function (err) {
                            if (err)
                                rej(err);
                            else
                                _this.addTTL(key, ttl).then(res);
                        });
                    })];
            });
        });
    };
    DatabaseManager.prototype.changeZSet = function (key, items, ttl) {
        return __awaiter(this, void 0, void 0, function () {
            var args;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        args = items.reduce(function (prev, curr) { return __spreadArray(__spreadArray([], prev, true), [curr.score, curr.value], false); }, []);
                        return [4 /*yield*/, (_a = this._instance).zadd.apply(_a, __spreadArray([key], args, false))];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, this.addTTL(key, ttl)];
                    case 2:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DatabaseManager.prototype.changeHash = function (key, values, ttl) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (res, rej) {
                        var items = Object.keys(values).reduce(function (prev, curr) { return __spreadArray(__spreadArray([], prev, true), [curr, String(values[curr])], false); }, Array());
                        _this._instance.hset(key, items, function (err) {
                            if (err)
                                rej(err);
                            else
                                _this.addTTL(key, ttl).then(res);
                        });
                    })];
            });
        });
    };
    DatabaseManager.prototype.changeList = function (key, value, ttl) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (res, rej) {
                        _this._instance.lpush(key, value, function (err) {
                            if (err)
                                rej(err);
                            else
                                _this.addTTL(key, ttl).then(res);
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
                            _this._instance.lpush(key, value, function (err) {
                                if (err)
                                    rej(err);
                                return res();
                            });
                        }
                        else {
                            _this._instance.rpush(key, value, function (err) {
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
                        var uuid = (0, uuid_1.v4)();
                        _this._instance.lset(key, index, uuid, function (err) {
                            if (err)
                                rej(err);
                            _this._instance.lrem(key, 1, uuid, function (err) {
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
                        _this._instance.lset(key, index, value, function (err) {
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
                        _this._instance.sadd(key, value, function (err) {
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
                        _this._instance.srem(key, value, function (err) {
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
            var args;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        args = [score, value];
                        return [4 /*yield*/, (_a = this._instance).zadd.apply(_a, __spreadArray([key], args, false))];
                    case 1:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DatabaseManager.prototype.removeZSetMember = function (key, value) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (res, rej) {
                        _this._instance.zrem(key, value, function (err) {
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
                        var items = Object.keys(values).reduce(function (prev, curr) { return __spreadArray(__spreadArray([], prev, true), [curr, String(values[curr])], false); }, Array());
                        _this._instance.hset(key, items, function (err) {
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
                        _this._instance.hdel(key, value, function (err) {
                            if (err)
                                rej(err);
                            return res();
                        });
                    })];
            });
        });
    };
    DatabaseManager.prototype.addKey = function (key, type, ttl) {
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
                    case 1: return [4 /*yield*/, this.changeString(key, "New Value", ttl)];
                    case 2:
                        _b.sent();
                        return [3 /*break*/, 12];
                    case 3: return [4 /*yield*/, this.changeSet(key, "New Member", ttl)];
                    case 4:
                        _b.sent();
                        return [3 /*break*/, 12];
                    case 5: return [4 /*yield*/, this.changeZSet(key, [{ score: "0", value: "New Member" }], ttl)];
                    case 6:
                        _b.sent();
                        return [3 /*break*/, 12];
                    case 7: return [4 /*yield*/, this.changeHash(key, { "New Item": "New Member" }, ttl)];
                    case 8:
                        _b.sent();
                        return [3 /*break*/, 12];
                    case 9: return [4 /*yield*/, this.changeList(key, "New Member", ttl)];
                    case 10:
                        _b.sent();
                        return [3 /*break*/, 12];
                    case 11: throw new Error("not impemented");
                    case 12: return [2 /*return*/];
                }
            });
        });
    };
    DatabaseManager.prototype.hydrateShallow = function (items) {
        return __awaiter(this, void 0, void 0, function () {
            var promises;
            var _this = this;
            return __generator(this, function (_a) {
                promises = items.map(function (item) { return __awaiter(_this, void 0, void 0, function () {
                    var response, _a;
                    var _this = this;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                response = {
                                    key: item,
                                    value: "",
                                    type: "",
                                    ttl: -1
                                };
                                _a = response;
                                return [4 /*yield*/, new Promise(function (res) {
                                        _this._instance.type(item, function (err, reply) {
                                            res(reply);
                                        });
                                    })];
                            case 1:
                                _a.type = _b.sent();
                                return [2 /*return*/, response];
                        }
                    });
                }); });
                return [2 /*return*/, Promise.all(promises)];
            });
        });
    };
    DatabaseManager.prototype.hydrateItems = function (items) {
        return __awaiter(this, void 0, void 0, function () {
            var promises;
            var _this = this;
            return __generator(this, function (_a) {
                promises = items.map(function (item) { return __awaiter(_this, void 0, void 0, function () {
                    var response, type, value, ttl;
                    var _this = this;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                response = {
                                    key: item,
                                    value: "",
                                    type: "",
                                    ttl: -1
                                };
                                return [4 /*yield*/, new Promise(function (res) {
                                        _this._instance.type(item, function (err, reply) {
                                            res(reply);
                                        });
                                    })];
                            case 1:
                                type = _a.sent();
                                return [4 /*yield*/, new Promise(function (res) {
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
                                return [4 /*yield*/, new Promise(function (res, rej) {
                                        _this._instance.pttl(item, function (err, ttl) {
                                            if (err)
                                                rej(err);
                                            if (ttl === -1)
                                                return res(-1);
                                            return res(new Date(Date.now() + ttl).getTime());
                                        });
                                    })];
                            case 3:
                                ttl = _a.sent();
                                response.value = value;
                                response.type = type;
                                response.ttl = ttl;
                                return [2 /*return*/, response];
                        }
                    });
                }); });
                return [2 /*return*/, Promise.all(promises)];
            });
        });
    };
    DatabaseManager.prototype.countDocuments = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this._instance.dbsize()];
            });
        });
    };
    DatabaseManager.prototype.loadMore = function (match, cursor
    // count = 10
    ) {
        if (cursor === void 0) { cursor = 0; }
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new Promise(function (res, rej) {
                            _this._instance.scan(cursor, "MATCH", match, function (err, reply) { return __awaiter(_this, void 0, void 0, function () {
                                var replycursor, items, response;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (err)
                                                rej(err);
                                            replycursor = reply[0], items = reply[1];
                                            return [4 /*yield*/, this.hydrateShallow(items)];
                                        case 1:
                                            response = _a.sent();
                                            res({
                                                docs: response,
                                                cursor: Number(replycursor)
                                            });
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
    DatabaseManager.prototype.findByName = function (match) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new Promise(function (res, rej) {
                            _this._instance.scan(0, "MATCH", match, function (err, reply) { return __awaiter(_this, void 0, void 0, function () {
                                var cursor, items, response;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (err)
                                                rej(err);
                                            cursor = reply[0], items = reply[1];
                                            return [4 /*yield*/, this.hydrateShallow(items)];
                                        case 1:
                                            response = _a.sent();
                                            res({
                                                docs: response,
                                                cursor: Number(cursor),
                                                totalDocs: items.length
                                            });
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
    DatabaseManager.prototype.findAll = function (cursor
    // count = 10
    ) {
        if (cursor === void 0) { cursor = 0; }
        return __awaiter(this, void 0, void 0, function () {
            var _a, replyCursor, items, totalCount, response;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this._instance.scan(cursor, "MATCH", "*")];
                    case 1:
                        _a = _b.sent(), replyCursor = _a[0], items = _a[1];
                        return [4 /*yield*/, this.countDocuments()];
                    case 2:
                        totalCount = _b.sent();
                        console.log({ totalCount: totalCount });
                        return [4 /*yield*/, this.hydrateShallow(items)];
                    case 3:
                        response = _b.sent();
                        return [2 /*return*/, {
                                docs: response,
                                cursor: Number(replyCursor),
                                totalDocs: totalCount
                            }];
                }
            });
        });
    };
    DatabaseManager.prototype.findByKeys = function (keys) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.hydrateItems(keys)];
            });
        });
    };
    return DatabaseManager;
}());
exports["default"] = DatabaseManager;
//# sourceMappingURL=index.js.map