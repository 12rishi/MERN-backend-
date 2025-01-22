import { Request, Response } from "express";
import User from "../database/models/userModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AuthHandler } from "../middleware/authMiddleware";
class AuthController {
  public static async registerUser(req: Request, res: Response): Promise<void> {
    const { email, username, password } = req.body;
    if (!email || !username || !password) {
      res.status(400).json({
        message: "provide all the required fields",
      });
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    await User.create({
      userName: username,
      email,
      password: hashedPassword,
    });
    res.status(200).json({
      message: "successfully stored the data",
    });
  }
  public static async loginUser(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({
        message: "please provide all the credentials",
      });
      return;
    }
    const [data] = await User.findAll({
      where: {
        email: email,
      },
    });
    if (!data) {
      res.status(404).json({
        message: "No user found",
      });
      return;
    }
    const isMatched = bcrypt.compareSync(password, data.password);
    if (!isMatched) {
      res.status(403).json({
        message: "invalid credential",
      });
      return;
    }
    const jwtKey = process.env.JWT_KEY as string;
    const token = jwt.sign({ id: data.id }, jwtKey, {
      expiresIn: "10d",
    });

    res.status(200).json({
      message: "successfully login",
      data: token,
    });
  }
  public static async fetchUsers(
    req: AuthHandler,
    res: Response
  ): Promise<void> {
    try {
      const users = await User.findAll();
      if (users.length > 0) {
        res.status(200).json({
          message: "successfully fetched users",
          data: users,
        });
      } else {
        res.status(400).json({
          message: "something went wrong",
        });
      }
    } catch (error) {
      res.status(500).json({
        message: "server erro",
        error: error,
      });
    }
  }
  public static async deleteUser(
    req: AuthHandler,
    res: Response
  ): Promise<void> {
    try {
      const id = req.params.id;
      if (!id) {
        res.status(400).json({
          message: "id is not defined",
        });
      } else {
        await User.destroy({ where: { id: id } });
        res.status(200).json({
          message: "successfully deleted",
        });
      }
    } catch (error: any) {
      res.status(500).json({
        message: "something went wrong",
        error: error?.message,
      });
    }
  }
}
export default AuthController;
