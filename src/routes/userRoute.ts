import express, { Router } from "express";
import AuthController from "../controllers/userController";
import handleError from "../services/tryCatch";
import authMiddleware, { Role } from "../middleware/authMiddleware";
const router: Router = express.Router();
router.route("/register").post(handleError(AuthController.registerUser));
router.route("/login").post(handleError(AuthController.loginUser));

router
  .route("/users")
  .get(
    authMiddleware.isAuthenticated,
    authMiddleware.restrictTo(Role.Admin),
    handleError(AuthController.fetchUsers)
  );
router
  .route("/users/:id")
  .delete(
    authMiddleware.isAuthenticated,
    authMiddleware.restrictTo(Role.Admin),
    AuthController.deleteUser
  );
export default router;
