import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../database/models/userModel";
dotenv.config();
interface AuthHandler extends Request {
  user?: {
    id: string;
    userName: string;
    password: string;
    email: string;
    role: string;
  };
}
export enum Role {
  Admin = "admin",
  Customer = "customer",
}
class AuthMiddleware {
  async isAuthenticated(
    req: AuthHandler,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const token = req.headers.authorization;
    if (!token || token === undefined || token === null) {
      res.status(403).json({
        message: "token is not valid",
      });
      return;
    }
    jwt.verify(
      token,
      process.env.JWT_KEY as string,
      async (err, decoded: any) => {
        if (err) {
          res.status(403).json({
            message: "invalid token",
          });
        } else {
          try {
            const data = await User.findByPk(decoded.id);
            if (!data) {
              res.status(404).json({
                message: "no use has been found for this id",
              });
              return;
            }
            req.user = data;
            next();
          } catch (error: any) {
            res.status(500).json({
              message: "something went wrong",
              error: error?.message,
            });
          }
        }
      }
    );
  }
  restrictTo(...roles: Role[]) {
    return (req: AuthHandler, res: Response, next: NextFunction) => {
      const userRole = req.user?.role as Role;
      if (!roles.includes(userRole)) {
        res.status(403).json({
          message: "permission not allowed",
        });
      } else {
        next();
      }
    };
  }
}
export default new AuthMiddleware();
