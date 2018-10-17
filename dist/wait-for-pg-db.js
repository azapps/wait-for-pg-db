#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var debug = require('debug')('showcase:ensure-kafka-topics:debug');
var Client = require('pg').Client;
var abort_after_tries = process.env.ABORT_AFTER_TRIES || 10;
var wait_between_tries_s = process.env.WAIT_BETWEEN_TRIES_S || 5;
function sleep(ms) {
    return new Promise(function (resolve) { return setTimeout(resolve, ms); });
}
function try_to_connect(abort_after_tries, wait_between_tries_s) {
    return __awaiter(this, void 0, void 0, function () {
        var tries_left, client, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tries_left = abort_after_tries;
                    _a.label = 1;
                case 1:
                    if (!(tries_left > 0)) return [3 /*break*/, 7];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    client = new Client();
                    return [4 /*yield*/, client.connect()];
                case 3:
                    _a.sent();
                    return [2 /*return*/, client];
                case 4:
                    e_1 = _a.sent();
                    debug("Could still not connect to the db", e_1);
                    return [3 /*break*/, 5];
                case 5:
                    tries_left--;
                    return [4 /*yield*/, sleep(wait_between_tries_s * 1000)];
                case 6:
                    _a.sent();
                    return [3 /*break*/, 1];
                case 7: throw new Error("Failed to connect to db");
            }
        });
    });
}
try_to_connect(abort_after_tries, wait_between_tries_s).then(function (client) { return __awaiter(_this, void 0, void 0, function () {
    var run_after_connect_raw, run_after_connect, _a, _b, _i, i, file, sql, e_2;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                run_after_connect_raw = process.env.RUN_AFTER_CONNECT;
                if (!run_after_connect_raw) return [3 /*break*/, 6];
                run_after_connect = run_after_connect_raw.split(",").map(function (x) { return x.trim(); });
                _a = [];
                for (_b in run_after_connect)
                    _a.push(_b);
                _i = 0;
                _c.label = 1;
            case 1:
                if (!(_i < _a.length)) return [3 /*break*/, 6];
                i = _a[_i];
                file = run_after_connect[i];
                sql = fs_1.default.readFileSync(file, 'utf8');
                _c.label = 2;
            case 2:
                _c.trys.push([2, 4, , 5]);
                return [4 /*yield*/, client.query(sql)];
            case 3:
                _c.sent();
                return [3 /*break*/, 5];
            case 4:
                e_2 = _c.sent();
                console.log("Failed to execute query", e_2);
                process.exit(1);
                return [3 /*break*/, 5];
            case 5:
                _i++;
                return [3 /*break*/, 1];
            case 6:
                client.end();
                process.exit(0);
                return [2 /*return*/];
        }
    });
}); }).catch(function (e) {
    console.log("Error:", e);
    process.exit(1);
});
