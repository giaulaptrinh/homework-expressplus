import { createServer, IncomingMessage, ServerResponse } from "http";
import { parse } from "url";

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
type Handler = (
  req: IncomingMessage & { query?: any },
  res: ServerResponse
) => void;

interface Route {
  path: string;
  handler: Handler;
}

export default class ExpressPlus {
  private routes: Record<Method, Route[]> = {
    GET: [],
    POST: [],
    PUT: [],
    PATCH: [],
    DELETE: [],
  };

  private addRoute(method: Method, path: string, handler: Handler): void {
    this.routes[method].push({ path, handler });
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

      if (route) {
        (req as any).query = parsedUrl.query;
        route.handler(req as any, res);
      } else {
        res.statusCode = 404;
        res.end("Not Found");
      }
    });

    server.listen(port, callback);
  }
}
