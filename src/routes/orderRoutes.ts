import express, { Router } from "express";
import authMiddleware, { Role } from "../middleware/authMiddleware";
import handleError from "../services/tryCatch";
import orderController from "../controllers/orderController";
const router: Router = express.Router();
router
  .route("/")
  .post(
    authMiddleware.isAuthenticated,
    handleError(orderController.createOrder)
  );
router
  .route("/verify")
  .post(
    authMiddleware.isAuthenticated,
    handleError(orderController.verifyKhaltiToken)
  );
router
  .route("/customer")
  .get(
    authMiddleware.isAuthenticated,
    handleError(orderController.fetchMyOrder)
  );
router
  .route("/customer/:id")
  .patch(
    authMiddleware.isAuthenticated,
    authMiddleware.restrictTo(Role.Customer),
    handleError(orderController.cancelMyOrder)
  )
  .get(
    authMiddleware.isAuthenticated,

    handleError(orderController.fetchOrderDetails)
  );
export default router;
