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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("http");
var url_1 = require("url");
var ExpressPlus = /** @class */ (function () {
    function ExpressPlus() {
        this.routes = {
            GET: [],
            POST: [],
            PUT: [],
            PATCH: [],
            DELETE: [],
        };
        this.middlewares = [];
    }
    ExpressPlus.prototype.addRoute = function (method, path, handler) {
        this.routes[method].push({ path: path, handler: handler });
    };
    ExpressPlus.prototype.use = function (middleware) {
        this.middlewares.push(middleware);
    };
    ExpressPlus.prototype.get = function (path, handler) {
        this.addRoute("GET", path, handler);
    };
    ExpressPlus.prototype.post = function (path, handler) {
        this.addRoute("POST", path, handler);
    };
    ExpressPlus.prototype.put = function (path, handler) {
        this.addRoute("PUT", path, handler);
    };
    ExpressPlus.prototype.patch = function (path, handler) {
        this.addRoute("PATCH", path, handler);
    };
    ExpressPlus.prototype.delete = function (path, handler) {
        this.addRoute("DELETE", path, handler);
    };
    ExpressPlus.prototype.listen = function (port, callback) {
        var _this = this;
        var server = (0, http_1.createServer)(function (req, res) {
            var method = req.method;
            var parsedUrl = (0, url_1.parse)(req.url || "", true);
            var pathname = parsedUrl.pathname || "/";
            var route = _this.routes[method].find(function (r) { return r.path === pathname; });
            var extendedReq = req;
            var extendedRes = res;
            extendedReq.query = parsedUrl.query;
            extendedReq.getBody = function () { return __awaiter(_this, void 0, void 0, function () {
                var chunks, _a, extendedReq_1, extendedReq_1_1, chunk, e_1_1, raw;
                var _b, e_1, _c, _d;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            if (extendedReq.body)
                                return [2 /*return*/, extendedReq.body];
                            chunks = [];
                            _e.label = 1;
                        case 1:
                            _e.trys.push([1, 6, 7, 12]);
                            _a = true, extendedReq_1 = __asyncValues(extendedReq);
                            _e.label = 2;
                        case 2: return [4 /*yield*/, extendedReq_1.next()];
                        case 3:
                            if (!(extendedReq_1_1 = _e.sent(), _b = extendedReq_1_1.done, !_b)) return [3 /*break*/, 5];
                            _d = extendedReq_1_1.value;
                            _a = false;
                            chunk = _d;
                            chunks.push(chunk);
                            _e.label = 4;
                        case 4:
                            _a = true;
                            return [3 /*break*/, 2];
                        case 5: return [3 /*break*/, 12];
                        case 6:
                            e_1_1 = _e.sent();
                            e_1 = { error: e_1_1 };
                            return [3 /*break*/, 12];
                        case 7:
                            _e.trys.push([7, , 10, 11]);
                            if (!(!_a && !_b && (_c = extendedReq_1.return))) return [3 /*break*/, 9];
                            return [4 /*yield*/, _c.call(extendedReq_1)];
                        case 8:
                            _e.sent();
                            _e.label = 9;
                        case 9: return [3 /*break*/, 11];
                        case 10:
                            if (e_1) throw e_1.error;
                            return [7 /*endfinally*/];
                        case 11: return [7 /*endfinally*/];
                        case 12:
                            raw = Buffer.concat(chunks).toString();
                            extendedReq.bodyRaw = raw;
                            try {
                                extendedReq.body = JSON.parse(raw);
                            }
                            catch (_f) {
                                extendedReq.body = {};
                            }
                            return [2 /*return*/, extendedReq.body];
                    }
                });
            }); };
            extendedRes.status = function (code) {
                extendedRes.statusCode = code;
                return extendedRes;
            };
            extendedRes.json = function (data) {
                extendedRes.setHeader("Content-Type", "application/json");
                extendedRes.end(JSON.stringify(data));
            };
            var i = 0;
            var next = function () {
                var middleware = _this.middlewares[i++];
                if (middleware) {
                    middleware(extendedReq, extendedRes, next);
                }
                else if (route) {
                    route.handler(extendedReq, extendedRes);
                }
                else {
                    extendedRes.status(404).end("Not Found");
                }
            };
            next();
        });
        server.listen(port, callback);
    };
    return ExpressPlus;
}());
// ✅ Export cho cả ES Module và CommonJS
exports.default = ExpressPlus;
module.exports = ExpressPlus;
