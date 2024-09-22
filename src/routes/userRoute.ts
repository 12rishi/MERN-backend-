import express, { Router } from "express";
import AuthController from "../controllers/userController";
import handleError from "../services/tryCatch";
const router: Router = express.Router();
router.route("/register").post(handleError(AuthController.registerUser));
router.route("/login").post(handleError(AuthController.loginUser));
export default router;
