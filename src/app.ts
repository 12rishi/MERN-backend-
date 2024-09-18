import express, { Application, Request, Response } from "express";
const app: Application = express();
require("./model/index");
const PORT: number = 3000;
app.get("/", (req: Request, res: Response) => {
  res.send("hello");
});
app.listen(PORT, () => {
  console.log("server has started at port no ", PORT);
});
