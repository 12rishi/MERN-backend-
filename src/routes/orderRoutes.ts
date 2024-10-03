import express, { Router } from "express";
import authMiddleware from "../middleware/authMiddleware";
import handleError from "../services/tryCatch";
import orderController from "../controllers/orderController";
const router: Router = express.Router();
router
  .route("/")
  .post(
    authMiddleware.isAuthenticated,
    handleError(orderController.createOrder)
  );
export default router;
