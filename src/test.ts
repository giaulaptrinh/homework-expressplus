import ExpressPlus from "./index";
import { sum, sub, mul, div } from "@gieo/utils";
const app = new ExpressPlus();

app.post("/calc", async (req, res) => {
  const { a, b, op } = await req.getBody();

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
});

// Các route cơ bản
app.get("/", (req, res) =>
  res.status(200).json({ success: true, status: 200, result: "GET / OK" })
);
app.put("/", (req, res) =>
  res.status(200).json({ success: true, status: 200, result: "PUT / OK" })
);
app.post("/", (req, res) =>
  res.status(200).json({ success: true, status: 200, result: "POST / OK" })
);
app.patch("/", (req, res) =>
  res.status(200).json({ success: true, status: 200, result: "PATCH / OK" })
);
app.delete("/", (req, res) =>
  res.status(200).json({ success: true, status: 200, result: "DELETE / OK" })
);

const mathRoute =
  (op: (a: number, b: number) => number) => async (req: any, res: any) => {
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
    } catch (err: any) {
      res
        .status(500)
        .json({ success: false, status: 500, result: err.message });
    }
  };

// Math operations
app.post("/sum", mathRoute(sum));
app.post("/sub", mathRoute(sub));
app.post("/mul", mathRoute(mul));
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
  const result = div(a, b);
  res.status(200).json({ success: true, status: 200, result });
});
app.listen(3000, () => {
  console.log("✅ Server is running at http://localhost:3000");
});
