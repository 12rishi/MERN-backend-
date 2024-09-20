import { Request, Response } from "express";
import User from "../database/models/userModel";
import bcrypt from "bcrypt";

class AuthController {
  public static async registerUser(req: Request, res: Response): Promise<void> {
    const { email, userName, password } = req.body;
    if (!email || !userName || !password) {
      res.status(400).json({
        message: "provide all the required fields",
      });
      return;
    }
    await User.create({
      userName,
      email,
      password: bcrypt.hash(password, 12),
    });
    res.status(200).json({
      message: "successfully stored the data",
    });
  }
}
export default AuthController;
