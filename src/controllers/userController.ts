import { Request, Response } from "express";
import User from "../database/models/userModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
class AuthController {
  public static async registerUser(req: Request, res: Response): Promise<void> {
    const { email, userName, password } = req.body;
    if (!email || !userName || !password) {
      res.status(400).json({
        message: "provide all the required fields",
      });
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    await User.create({
      userName,
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
}
export default AuthController;
