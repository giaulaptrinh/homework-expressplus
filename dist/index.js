"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const url_1 = require("url");
class ExpressPlus {
    constructor() {
        this.routes = {
            GET: [],
            POST: [],
            PUT: [],
            PATCH: [],
            DELETE: [],
        };
        this.middlewares = [];
    }
    addRoute(method, path, handler) {
        this.routes[method].push({ path, handler });
    }
    use(middleware) {
        this.middlewares.push(middleware);
    }
    get(path, handler) {
        this.addRoute("GET", path, handler);
    }
    post(path, handler) {
        this.addRoute("POST", path, handler);
    }
    put(path, handler) {
        this.addRoute("PUT", path, handler);
    }
    patch(path, handler) {
        this.addRoute("PATCH", path, handler);
    }
    delete(path, handler) {
        this.addRoute("DELETE", path, handler);
    }
    listen(port, callback) {
        const server = (0, http_1.createServer)((req, res) => {
            const method = req.method;
            const parsedUrl = (0, url_1.parse)(req.url || "", true);
            const pathname = parsedUrl.pathname || "/";
            const extendedReq = req;
            const extendedRes = res;
            extendedReq.query = parsedUrl.query;
            extendedReq.params = {};
            extendedReq.getBody = async () => {
                if (extendedReq.body)
                    return extendedReq.body;
                const chunks = [];
                for await (const chunk of extendedReq) {
                    chunks.push(chunk);
                }
                const raw = Buffer.concat(chunks).toString();
                extendedReq.bodyRaw = raw;
                try {
                    extendedReq.body = JSON.parse(raw);
                }
                catch {
                    extendedReq.body = {};
                }
                return extendedReq.body;
            };
            extendedRes.status = function (code) {
                extendedRes.statusCode = code;
                return extendedRes;
            };
            extendedRes.json = function (data) {
                extendedRes.setHeader("Content-Type", "application/json");
                extendedRes.end(JSON.stringify(data));
            };
            // 🔍 Tìm route phù hợp (hỗ trợ dynamic route)
            const route = this.routes[method].find((r) => {
                const routeParts = r.path.split("/").filter(Boolean);
                const urlParts = pathname.split("/").filter(Boolean);
                if (routeParts.length !== urlParts.length)
                    return false;
                return routeParts.every((part, i) => {
                    return part.startsWith(":") || part === urlParts[i];
                });
            });
            // 🧠 Trích xuất params nếu có
            if (route) {
                const routeParts = route.path.split("/").filter(Boolean);
                const urlParts = pathname.split("/").filter(Boolean);
                routeParts.forEach((part, i) => {
                    if (part.startsWith(":")) {
                        const key = part.slice(1);
                        extendedReq.params[key] = urlParts[i];
                    }
                });
            }
            // 🧪 Logging đơn giản
            console.log(`[${method}] ${pathname}`);
            // 🧩 Middleware + Route handler
            let i = 0;
            const next = () => {
                const middleware = this.middlewares[i++];
                if (middleware) {
                    middleware(extendedReq, extendedRes, next);
                }
                else if (route) {
                    route.handler(extendedReq, extendedRes);
                }
                else {
                    extendedRes.status(404).json({ message: "Not Found" });
                }
            };
            next();
        });
        server.listen(port, callback);
    }
}
exports.default = ExpressPlus;
