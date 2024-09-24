import { Request, Response } from "express";
import Product from "../database/models/productModel";

class ProductController {
  async addproduct(req: Request, res: Response): Promise<void> {
    const { productName, productDescription, productPrice, productQty } =
      req.body;
    if (!productDescription || !productName || !productPrice || !productQty) {
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
    });
    res.status(200).json({
      message: "successfully added the product",
    });
    return;
  }
}
export default new ProductController();
