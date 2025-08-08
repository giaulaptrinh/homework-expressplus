"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("./index");
var utils_1 = require("@gieo/utils");
var app = new index_1.default();
// GET /
app.get("/", function (req, res) {
    res.end("Hello, World!");
});
// GET /hello?name=...
app.get("/hello", function (req, res) {
    var name = req.query.name || "Guest";
    res.end("Hello, ".concat(name, "!"));
});
// Middleware để parse body JSON
app.use(function (req, res, next) {
    var body = "";
    req.on("data", function (chunk) {
        body += chunk.toString();
    });
    req.on("end", function () {
        try {
            req.body = JSON.parse(body);
        }
        catch (e) {
            req.body = {};
        }
        next();
    });
});
// POST /calculate
app.post("/calculate", function (req, res) {
    var _a = req.body, a = _a.a, b = _a.b, op = _a.op;
    if (typeof a !== "number" || typeof b !== "number") {
        res.statusCode = 400;
        return res.end("a và b phải là số");
    }
    var result;
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
            res.statusCode = 400;
            return res.end("Toán tử không hợp lệ (sum, sub, mul, div)");
    }
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ result: result }));
});
// Các route khác
app.put("/update", function (req, res) {
    res.end("Update successful");
});
app.patch("/modify", function (req, res) {
    res.end("Modify successful");
});
app.delete("/delete", function (req, res) {
    res.end("Delete successful");
});
// Start server
app.listen(3000, function () {
    console.log("Server is running on http://localhost:3000");
});
