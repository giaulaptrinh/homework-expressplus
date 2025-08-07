"use strict";
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
    }
    ExpressPlus.prototype.addRoute = function (method, path, handler) {
        this.routes[method].push({ path: path, handler: handler });
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
            if (route) {
                req.query = parsedUrl.query;
                route.handler(req, res);
            }
            else {
                res.statusCode = 404;
                res.end("Not Found");
            }
        });
        server.listen(port, callback);
    };
    return ExpressPlus;
}());
exports.default = ExpressPlus;
