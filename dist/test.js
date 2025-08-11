"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("./index"));
const utils_1 = require("@gieo/utils");
const app = new index_1.default();
app.post("/calc", async (req, res) => {
    const { op, ...numbers } = await req.getBody();
    // Lấy tất cả giá trị số từ body
    const values = Object.values(numbers)
        .map(Number)
        .filter((v) => !isNaN(v));
    if (values.length < 2) {
        return res.status(400).json({
            statusCode: 400,
            success: false,
            message: "Need at least two numeric values",
        });
    }
    let result;
    try {
        switch (op) {
            case "sum":
                result = (0, utils_1.sum)(...values);
                break;
            case "sub":
                result = (0, utils_1.sub)(...values);
                break;
            case "mul":
                result = (0, utils_1.mul)(...values);
                break;
            case "div":
                result = (0, utils_1.div)(...values);
                break;
            default:
                return res.status(400).json({
                    statusCode: 400,
                    success: false,
                    message: "Invalid operator",
                });
        }
        return res.status(200).json({
            statusCode: 200,
            success: true,
            result,
        });
    }
    catch (err) {
        return res.status(500).json({
            statusCode: 500,
            success: false,
            message: err.message,
        });
    }
});
// Các route cơ bản
app.get("/", (req, res) => res.status(200).json({ success: true, status: 200, result: "GET / OK" }));
app.put("/", (req, res) => res.status(200).json({ success: true, status: 200, result: "PUT / OK" }));
app.post("/", (req, res) => res.status(200).json({ success: true, status: 200, result: "POST / OK" }));
app.patch("/", (req, res) => res.status(200).json({ success: true, status: 200, result: "PATCH / OK" }));
app.delete("/", (req, res) => res.status(200).json({ success: true, status: 200, result: "DELETE / OK" }));
const mathRoute = (op) => async (req, res) => {
    const { a, b } = await req.getBody();
    if (typeof a !== "number" || typeof b !== "number") {
        return res.status(400).json({
            success: false,
            status: 400,
            result: "Invalid input. 'a' and 'b' must be numbers.",
        });
    }
    try {
        const result = op(a, b);
        res.status(200).json({ success: true, status: 200, result });
    }
    catch (err) {
        res
            .status(500)
            .json({ success: false, status: 500, result: err.message });
    }
};
// Math operations
app.post("/sum", mathRoute(utils_1.sum));
app.post("/sub", mathRoute(utils_1.sub));
app.post("/mul", mathRoute(utils_1.mul));
app.post("/div", async (req, res) => {
    const { a, b } = await req.getBody();
    if (typeof a !== "number" || typeof b !== "number") {
        return res.status(400).json({
            success: false,
            status: 400,
            result: "Invalid input. 'a' and 'b' must be numbers.",
        });
    }
    if (b === 0) {
        return res
            .status(400)
            .json({ success: false, status: 400, result: "Cannot divide by zero" });
    }
    const result = (0, utils_1.div)(a, b);
    res.status(200).json({ success: true, status: 200, result });
});
app.listen(3000, () => {
    console.log("✅ Server is running at http://localhost:3000");
});
