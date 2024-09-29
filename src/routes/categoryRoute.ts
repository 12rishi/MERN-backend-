import express, { Router } from "express";
import authMiddleware, { Role } from "../middleware/authMiddleware";
import Category from "../database/models/categoryModel";
import categoryController from "../controllers/categoryController";
const router: Router = express.Router();
router
  .route("/category")
  .post(
    authMiddleware.isAuthenticated,
    authMiddleware.restrictTo(Role.Admin),
    categoryController.addCategory
  )
  .get(categoryController.findCategory);
router
  .route("/category/:id")
  .delete(
    authMiddleware.isAuthenticated,
    authMiddleware.restrictTo(Role.Admin),
    categoryController.deleteCategory
  )
  .patch(
    authMiddleware.isAuthenticated,
    authMiddleware.restrictTo(Role.Admin),
    categoryController.updateCategory
  );
export default router;
