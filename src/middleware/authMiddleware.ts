import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../database/models/userModel";
dotenv.config();
export interface AuthHandler extends Request {
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
      async (err, decoded: any): Promise<void> => {
        if (err) {
          res.status(403).json({
            message: "invalid token",
          });
        } else {
          try {
            console.log("id is ", decoded.id);
            const data = await User.findByPk(decoded.id);

            if (!data) {
              res.status(404).json({
                message: "no user has been found for this id",
              });
            } else {
              req.user = data;
              next();
            }
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
