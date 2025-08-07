"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("./index");
var app = new index_1.default();
app.get("/", function (req, res) {
    res.end("Hello, World!");
});
app.get("/hello", function (req, res) {
    var name = req.query.name || "Guest";
    res.end("Hello, ".concat(name, "!"));
});
app.post("/data", function (req, res) {
    var body = "";
    req.on("data", function (chunk) {
        body += chunk.toString();
    });
    req.on("end", function () {
        res.end("Received data: ".concat(body));
    });
});
app.put("/update", function (req, res) {
    res.end("Update successful");
});
app.patch("/modify", function (req, res) {
    res.end("Modify successful");
});
app.delete("/delete", function (req, res) {
    res.end("Delete successful");
});
app.listen(3000, function () {
    console.log("Server is running on http://localhost:3000");
});
