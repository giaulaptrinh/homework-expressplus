import ExpressPlus from "./index";
const app = new ExpressPlus();

app.get("/", (req, res) => {
  res.end("Hello, World!");
});
app.get("/hello", (req, res) => {
  const name = req.query.name || "Guest";
  res.end(`Hello, ${name}!`);
});
app.post("/data", (req, res) => {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });
  req.on("end", () => {
    res.end(`Received data: ${body}`);
  });
});
app.put("/update", (req, res) => {
  res.end("Update successful");
});
app.patch("/modify", (req, res) => {
  res.end("Modify successful");
});
app.delete("/delete", (req, res) => {
  res.end("Delete successful");
});
app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
