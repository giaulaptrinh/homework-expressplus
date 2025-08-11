import { createServer, IncomingMessage, ServerResponse } from "http";
import { parse } from "url";

// Mở rộng Request
interface ExtendedRequest extends IncomingMessage {
  query?: Record<string, string | string[]>;
  bodyRaw?: string;
  body?: any;
  getBody: () => Promise<any>;
}

// Mở rộng Response
interface ExtendedResponse extends ServerResponse {
  status: (code: number) => ExtendedResponse;
  json: (data: any) => void;
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
    const server = createServer((req, res) => {
      const method = req.method as Method;
      const parsedUrl = parse(req.url || "", true);
      const pathname = parsedUrl.pathname || "/";

      const route = this.routes[method].find((r) => r.path === pathname);

      const extendedReq = req as ExtendedRequest;
      const extendedRes = res as ExtendedResponse;

      extendedReq.query = parsedUrl.query;
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

      extendedRes.status = function (code: number) {
        extendedRes.statusCode = code;
        return extendedRes;
      };

      extendedRes.json = function (data: any) {
        extendedRes.setHeader("Content-Type", "application/json");
        extendedRes.end(JSON.stringify(data));
      };

      let i = 0;
      const next = () => {
        const middleware = this.middlewares[i++];
        if (middleware) {
          middleware(extendedReq, extendedRes, next);
        } else if (route) {
          route.handler(extendedReq, extendedRes);
        } else {
          extendedRes.status(404).end("Not Found");
        }
      };

      next();
    });

    server.listen(port, callback);
  }
}

// ✅ Export cho cả ES Module và CommonJS
export default ExpressPlus;
module.exports = ExpressPlus;
