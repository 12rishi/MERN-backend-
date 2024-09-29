import { Request, Response } from "express";
import { AuthHandler } from "../middleware/authMiddleware";
import Cart from "../database/models/cartModel";
import Product from "../database/models/productModel";
class CartController {
  async addCart(req: AuthHandler, res: Response): Promise<void> {
    const userId = req.user?.id;
    const { productId, quantity } = req.body;
    if (!productId || !quantity) {
      res.status(400).json({
        message: "please provide the productId and quantity",
      });
      return;
    }
    let cartItem = await Cart.findOne({
      where: {
        userId,
        productId,
      },
    });
    if (cartItem) {
      cartItem.quantity += quantity;
      await cartItem.save();
      return;
    } else {
      cartItem = await Cart.create({
        productId,
        quantity,
        userId,
      });
      res.status(200).json({
        message: "successfully added cart item",
        data: cartItem,
      });
      return;
    }
  }
  async getAllcart(req: AuthHandler, res: Response): Promise<void> {
    const userId = req.user?.id;
    let allCartItem = await Cart.findAll({
      where: {
        userId: userId,
      },
    });
    if (allCartItem.length === 0) {
      res.status(404).json({
        message: "no cart has been added",
      });
      return;
    } else {
      allCartItem = await Cart.findAll({
        where: {
          userId: userId,
        },
        include: [{ model: Product }],
      });
      res.status(200).json({
        message: "successfully got all the carts",
        data: allCartItem,
      });
      return;
    }
  }
}
export default new CartController();
