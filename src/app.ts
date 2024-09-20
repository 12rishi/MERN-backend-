import express, { Application, Request, Response } from "express";
import * as dotenv from "dotenv";
dotenv.config();
import "./database/connection";
import userRoute from "./routes/userRoute";

const app: Application = express();
app.use(express.json());
app.use("", userRoute);
const PORT: number = Number(process.env.PORT) || 3000;

app.listen(PORT, () => {
  console.log("server has started at port no ", PORT);
});
