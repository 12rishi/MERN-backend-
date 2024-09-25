import { Request, Response } from "express";
import Product from "../database/models/productModel";
import { AuthHandler } from "../middleware/authMiddleware";
import User from "../database/models/userModel";
import Category from "../database/models/categoryModel";

class ProductController {
  async addproduct(req: AuthHandler, res: Response): Promise<void> {
    const id = req.user?.id;
    const {
      productName,
      productDescription,
      productPrice,
      productQty,
      categoryId,
    } = req.body;
    if (
      !productDescription ||
      !productName ||
      !productPrice ||
      !productQty ||
      !categoryId
    ) {
      res.status(400).json({
        message: "please provide all the details",
      });
      return;
    }
    let fileName: string;
    if (req.file) {
      fileName = req.file?.filename;
    } else {
      fileName =
        "https://ca-times.brightspotcdn.com/dims4/default/8fe0b21/2147483647/strip/true/crop/6122x4081+0+1/resize/1440x960!/quality/75/?url=https%3A%2F%2Fcalifornia-times-brightspot.s3.amazonaws.com%2F0b%2F7b%2F5b56302840069c22cf1fa46957be%2F1351750-fi-sneaker-buyer-coolkicks-jlc-16172-009.jpg";
    }
    await Product.create({
      productDescription,
      productName,
      productPrice,
      productQty,
      productImageUrl: fileName,
      userId: id,
      categoryId,
    });
    res.status(200).json({
      message: "successfully added the product",
    });
    return;
  }
  async getAllProduct(req: Request, res: Response): Promise<void> {
    const data = await Product.findAll({
      include: [
        {
          model: User,
          attributes: ["id", "userName", "email"],
        },
        {
          model: Category,
          attributes: ["id", "categoryName"],
        },
      ],
    });
    res.status(200).json({
      message: "successfully fetched the message",
      data: data,
    });
  }
}
export default new ProductController();
