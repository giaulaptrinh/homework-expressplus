import { createServer, IncomingMessage, ServerResponse } from "http";
import { parse } from "url";

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
type Handler = (
  req: IncomingMessage & { query?: any; body?: any },
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

  private middlewares: ((
    req: IncomingMessage & { query?: any; body?: any },
    res: ServerResponse,
    next: () => void
  ) => void)[] = [];

  private addRoute(method: Method, path: string, handler: Handler): void {
    this.routes[method].push({ path, handler });
  }

  use(
    middleware: (
      req: IncomingMessage & { query?: any; body?: any },
      res: ServerResponse,
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

      (req as any).query = parsedUrl.query;
      (req as any).body = {};

      let i = 0;

      const next = () => {
        const middleware = this.middlewares[i++];
        if (middleware) {
          middleware(req as any, res, next);
        } else if (route) {
          route.handler(req as any, res);
        } else {
          res.statusCode = 404;
          res.end("Not Found");
        }
      };

      next();
    });

    server.listen(port, callback);
  }
}
