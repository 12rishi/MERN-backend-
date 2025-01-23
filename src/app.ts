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
import { Server } from "socket.io";
import { promisify } from "util";
import jwt from "jsonwebtoken";
import User from "./database/models/userModel";

const app: Application = express();
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
app.use(express.static(".src/storage/"));
app.use("", userRoute);
app.use("/admin", productRoute);
app.use("/admin/", categoryRoute);
app.use("/customer", cartCategory);
app.use("/order", orderRoute);
adminSeeder();
const PORT: number = Number(process.env.PORT) || 3000;

const server = app.listen(PORT, () => {
  categoryController.seedCategory();
  console.log("server has started at port no ", PORT);
});
let onlineUSer: any = [];
const addToOnlineUser = (socketId: string, userId: string, role: string) => {
  onlineUSer = onlineUSer.filter((user: any) => user.userId !== userId);
  onlineUSer.push({ socketId, userId, role });
};
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173/", "http://localhost:5174/"],
  },
});
io.on("connection", async (socket) => {
  const { token } = socket.handshake.auth;
  if (token) {
    //@ts-ignore
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_KEY);
    //@ts-ignore
    const decodedUSerExist = await User.findByPk(decoded?.id);

    if (decodedUSerExist) {
      addToOnlineUser(socket.id, decodedUSerExist.id, decodedUSerExist.role);
    }
  }
  socket.on("updatedOrderStatus", ({ status, orderId, userId }) => {
    const findUser = onlineUSer.find((user: any) => user.userId == userId);
    if (findUser) {
      io.to(findUser.socketId).emit("statusUpdate", { status, orderId });
    }
  });
});
