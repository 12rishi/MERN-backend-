import express, { Application, Request, Response } from "express";
import * as dotenv from "dotenv";
dotenv.config();
import "./database/connection";
import userRoute from "./routes/userRoute";
import adminSeeder from "./adminSeeder";
import productRoute from "./routes/productRoute";
import categoryController from "./controllers/categoryController";

const app: Application = express();

app.use(express.json());
app.use("", userRoute);
app.use("/admin", productRoute);
adminSeeder();
const PORT: number = Number(process.env.PORT) || 3000;

app.listen(PORT, () => {
  categoryController.seedCategory();
  console.log("server has started at port no ", PORT);
});
