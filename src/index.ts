import { createServer, IncomingMessage, ServerResponse } from "http";
import { parse } from "url";
import ejs from "ejs";
import path from "path";
import fs from "fs";

// Mở rộng Request
interface ExtendedRequest extends IncomingMessage {
  query?: Record<string, string | string[]>;
  params?: Record<string, string>;
  bodyRaw?: string;
  body?: any;
  getBody: () => Promise<any>;
}

// Mở rộng Response
interface ExtendedResponse extends ServerResponse {
  status: (code: number) => ExtendedResponse;
  json: (data: any) => void;
  render: (view: string, data?: any) => void;
}

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
type Handler = (req: ExtendedRequest, res: ExtendedResponse) => void;

interface Route {
  path: string;
  handler: Handler;
}

class ExpressPlus {
  private routes: Record<Method, Route[]> = {
    GET: [],
    POST: [],
    PUT: [],
    PATCH: [],
    DELETE: [],
  };

  private middlewares: ((
    req: ExtendedRequest,
    res: ExtendedResponse,
    next: () => void
  ) => void)[] = [];

  // Lưu viewsPath như một thuộc tính của instance
  private viewsPath: string;

  constructor(options: { viewsPath?: string } = {}) {
    this.viewsPath = options.viewsPath || path.join(process.cwd(), "views");
    if (!fs.existsSync(this.viewsPath)) {
      throw new Error(`Views directory "${this.viewsPath}" does not exist`);
    }
  }

  private addRoute(method: Method, path: string, handler: Handler): void {
    this.routes[method].push({ path, handler });
  }

  use(
    middleware: (
      req: ExtendedRequest,
      res: ExtendedResponse,
      next: () => void
    ) => void
  ): void {
    this.middlewares.push(middleware);
  }

  get(path: string, handler: Handler): void {
    this.addRoute("GET", path, handler);
  }

  post(path: string, handler: Handler): void {
    this.addRoute("POST", path, handler);
  }

  put(path: string, handler: Handler): void {
    this.addRoute("PUT", path, handler);
  }

  patch(path: string, handler: Handler): void {
    this.addRoute("PATCH", path, handler);
  }

  delete(path: string, handler: Handler): void {
    this.addRoute("DELETE", path, handler);
  }

  listen(port: number, callback: () => void): void {
    const server = createServer(async (req, res) => {
      const method = req.method as Method;
      const parsedUrl = parse(req.url || "", true);
      const pathname = parsedUrl.pathname || "/";

      const extendedReq = req as ExtendedRequest;
      const extendedRes = res as ExtendedResponse;

      extendedReq.query = parsedUrl.query;
      extendedReq.params = {};
      extendedReq.getBody = async () => {
        if (extendedReq.body) return extendedReq.body;

        const chunks: Buffer[] = [];
        for await (const chunk of extendedReq) {
          chunks.push(chunk);
        }

        const raw = Buffer.concat(chunks).toString();
        extendedReq.bodyRaw = raw;

        try {
          extendedReq.body = JSON.parse(raw);
        } catch {
          extendedReq.body = {};
        }

        return extendedReq.body;
      };

      // Bind methods with correct context
      extendedRes.status = function (code: number) {
        this.statusCode = code;
        return this;
      }.bind(extendedRes);

      extendedRes.json = function (data: any) {
        this.setHeader("Content-Type", "application/json");
        this.end(JSON.stringify(data));
      }.bind(extendedRes);

      // Define render with closure to access viewsPath
      extendedRes.render = (function (appInstance: ExpressPlus) {
        return function (this: ExtendedResponse, view: string, data: any = {}) {
          const filePath = path.join(appInstance.viewsPath, `${view}.ejs`);
          if (!fs.existsSync(filePath)) {
            this.statusCode = 404;
            this.end(
              `View "${view}.ejs" not found in ${appInstance.viewsPath}`
            );
            return;
          }
          const html = ejs.render(fs.readFileSync(filePath, "utf-8"), data);
          this.setHeader("Content-Type", "text/html");
          this.end(html);
        };
      })(this); // Pass the ExpressPlus instance to closure

      // 🔍 Tìm route phù hợp (hỗ trợ dynamic route)
      const route = this.routes[method].find((r) => {
        const routeParts = r.path.split("/").filter(Boolean);
        const urlParts = pathname.split("/").filter(Boolean);

        if (routeParts.length !== urlParts.length) return false;

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
            extendedReq.params![key] = urlParts[i];
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
        } else if (route) {
          route.handler(extendedReq, extendedRes);
        } else {
          extendedRes.status(404).json({ message: "Not Found" });
        }
      };

      next();
    });

    server.listen(port, callback);
  }
}

export default ExpressPlus;
export { ExtendedRequest, ExtendedResponse };
