"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const url_1 = require("url");
const ejs_1 = __importDefault(require("ejs"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
class ExpressPlus {
    constructor(options = {}) {
        this.routes = {
            GET: [],
            POST: [],
            PUT: [],
            PATCH: [],
            DELETE: [],
        };
        this.middlewares = [];
        this.viewsPath = options.viewsPath || path_1.default.join(process.cwd(), "views");
        if (!fs_1.default.existsSync(this.viewsPath)) {
            throw new Error(`Views directory "${this.viewsPath}" does not exist`);
        }
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
        const server = (0, http_1.createServer)(async (req, res) => {
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
                this.statusCode = code;
                return this;
            }.bind(this);
            extendedRes.json = function (data) {
                this.setHeader("Content-Type", "application/json");
                this.end(JSON.stringify(data));
            }.bind(this);
            // Bind render method with the correct context
            extendedRes.render = function (view, data = {}) {
                const filePath = path_1.default.join(this.viewsPath, `${view}.ejs`); // Sử dụng this.viewsPath từ instance
                if (!fs_1.default.existsSync(filePath)) {
                    this.status(404).end(`View "${view}.ejs" not found in ${this.viewsPath}`);
                    return;
                }
                const html = ejs_1.default.render(fs_1.default.readFileSync(filePath, "utf-8"), data);
                this.setHeader("Content-Type", "text/html");
                this.end(html);
            }.bind(this); // Bind this để giữ context của ExpressPlus
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
