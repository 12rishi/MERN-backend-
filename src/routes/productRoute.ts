import express, { Router } from "express";
import authMiddleware, { Role } from "../middleware/authMiddleware";
import productController from "../controllers/productController";
const router: Router = express.Router();
import { multer, storage } from "../middleware/multer";
import Product from "../database/models/productModel";
const upload = multer({ storage: storage });

router
  .route("/product")
  .post(
    authMiddleware.isAuthenticated,
    authMiddleware.restrictTo(Role.Admin),
    upload.single("image"),
    productController.addproduct
  )
  .get(productController.getAllProduct);
export default router;
