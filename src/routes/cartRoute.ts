import express, { Router } from "express";
import authMiddleware from "../middleware/authMiddleware";
import cartController from "../controllers/cartController";
const router: Router = express.Router();
router
  .route("/cart")
  .post(authMiddleware.isAuthenticated, cartController.addCart)
  .get(authMiddleware.isAuthenticated, cartController.getAllcart);
export default router;
