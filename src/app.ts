import express, { Application, Request, Response } from "express";
import * as dotenv from "dotenv";
dotenv.config();
import "./database/connection";
import userRoute from "./routes/userRoute";
import adminSeeder from "./adminSeeder";
import productRoute from "./routes/productRoute";
import categoryController from "./controllers/categoryController";
import categoryRoute from "./routes/categoryRoute";
import cartCategory from "./routes/cartRoute";
import orderRoute from "./routes/orderRoutes";
import cors from "cors";

const app: Application = express();
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
app.use("", userRoute);
app.use("/admin", productRoute);
app.use("/admin/", categoryRoute);
app.use("/customer", cartCategory);
app.use("/order", orderRoute);
adminSeeder();
const PORT: number = Number(process.env.PORT) || 3000;

app.listen(PORT, () => {
  categoryController.seedCategory();
  console.log("server has started at port no ", PORT);
});
