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
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("./index");
var utils_1 = require("@gieo/utils");
var app = new index_1.default();
app.post("/calc", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, a, b, op, result;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, req.getBody()];
            case 1:
                _a = _b.sent(), a = _a.a, b = _a.b, op = _a.op;
                switch (op) {
                    case "sum":
                        result = (0, utils_1.sum)(a, b);
                        break;
                    case "sub":
                        result = (0, utils_1.sub)(a, b);
                        break;
                    case "mul":
                        result = (0, utils_1.mul)(a, b);
                        break;
                    case "div":
                        result = (0, utils_1.div)(a, b);
                        break;
                    default:
                        return [2 /*return*/, res.status(400).json({
                                statusCode: 400,
                                success: false,
                                message: "Invalid operator",
                            })];
                }
                return [2 /*return*/, res.status(200).json({
                        statusCode: 200,
                        success: true,
                        result: result,
                    })];
        }
    });
}); });
// Các route cơ bản
app.get("/", function (req, res) {
    return res.status(200).json({ success: true, status: 200, result: "GET / OK" });
});
app.put("/", function (req, res) {
    return res.status(200).json({ success: true, status: 200, result: "PUT / OK" });
});
app.post("/", function (req, res) {
    return res.status(200).json({ success: true, status: 200, result: "POST / OK" });
});
app.patch("/", function (req, res) {
    return res.status(200).json({ success: true, status: 200, result: "PATCH / OK" });
});
app.delete("/", function (req, res) {
    return res.status(200).json({ success: true, status: 200, result: "DELETE / OK" });
});
var mathRoute = function (op) { return function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, a, b, result;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, req.getBody()];
            case 1:
                _a = _b.sent(), a = _a.a, b = _a.b;
                if (typeof a !== "number" || typeof b !== "number") {
                    return [2 /*return*/, res.status(400).json({
                            success: false,
                            status: 400,
                            result: "Invalid input. 'a' and 'b' must be numbers.",
                        })];
                }
                try {
                    result = op(a, b);
                    res.status(200).json({ success: true, status: 200, result: result });
                }
                catch (err) {
                    res
                        .status(500)
                        .json({ success: false, status: 500, result: err.message });
                }
                return [2 /*return*/];
        }
    });
}); }; };
// Math operations
app.post("/sum", mathRoute(utils_1.sum));
app.post("/sub", mathRoute(utils_1.sub));
app.post("/mul", mathRoute(utils_1.mul));
app.post("/div", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, a, b, result;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, req.getBody()];
            case 1:
                _a = _b.sent(), a = _a.a, b = _a.b;
                if (typeof a !== "number" || typeof b !== "number") {
                    return [2 /*return*/, res.status(400).json({
                            success: false,
                            status: 400,
                            result: "Invalid input. 'a' and 'b' must be numbers.",
                        })];
                }
                if (b === 0) {
                    return [2 /*return*/, res
                            .status(400)
                            .json({ success: false, status: 400, result: "Cannot divide by zero" })];
                }
                result = (0, utils_1.div)(a, b);
                res.status(200).json({ success: true, status: 200, result: result });
                return [2 /*return*/];
        }
    });
}); });
app.listen(3000, function () {
    console.log("✅ Server is running at http://localhost:3000");
});
