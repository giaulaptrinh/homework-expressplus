import ExpressPlus from "./index";
import { sum, sub, mul, div } from "@gieo/utils";

const app = new ExpressPlus();

// GET /
app.get("/", (req, res) => {
  res.end("Hello, World!");
});

// GET /hello?name=...
app.get("/hello", (req, res) => {
  const name = req.query.name || "Guest";
  res.end(`Hello, ${name}!`);
});

// Middleware để parse body JSON
app.use((req, res, next) => {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });
  req.on("end", () => {
    try {
      req.body = JSON.parse(body);
    } catch (e) {
      req.body = {};
    }
    next();
  });
});

// POST /calculate
app.post("/calculate", (req, res) => {
  const { a, b, op } = req.body;

  if (typeof a !== "number" || typeof b !== "number") {
    res.statusCode = 400;
    return res.end("a và b phải là số");
  }

  let result: number;

  switch (op) {
    case "sum":
      result = sum(a, b);
      break;
    case "sub":
      result = sub(a, b);
      break;
    case "mul":
      result = mul(a, b);
      break;
    case "div":
      result = div(a, b);
      break;
    default:
      res.statusCode = 400;
      return res.end("Toán tử không hợp lệ (sum, sub, mul, div)");
  }

  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({ result }));
});

// Các route khác
app.put("/update", (req, res) => {
  res.end("Update successful");
});

app.patch("/modify", (req, res) => {
  res.end("Modify successful");
});

app.delete("/delete", (req, res) => {
  res.end("Delete successful");
});

// Start server
app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
