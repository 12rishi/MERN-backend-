import { Request, Response } from "express";
import { AuthHandler } from "../middleware/authMiddleware";
import Cart from "../database/models/cartModel";
import Product from "../database/models/productModel";
import Category from "../database/models/categoryModel";
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
        include: [
          {
            model: Product,
            include: [{ model: Category, attributes: ["id", "categoryName"] }],
          },
        ],
      });
      res.status(200).json({
        message: "successfully got all the carts",
        data: allCartItem,
      });
      return;
    }
  }
  async deleteCart(req: AuthHandler, res: Response): Promise<void> {
    const userId = req.user?.id;
    const { id: productId } = req.params;
    const data = await Product.findByPk(productId);
    if (!data) {
      res.status(404).json({
        message: "data not found",
      });
      return;
    }
    await Cart.destroy({
      where: {
        userId,
        productId,
      },
    });
    res.status(204).json({
      message: "desleted data successfully",
    });
    return;
  }
  async updateCart(req: AuthHandler, res: Response): Promise<void> {
    const { quantity } = req.body;
    if (!quantity) {
      res.status(400).json({
        message: "provide quantity to update",
      });
      return;
    }
    const userId = req.user?.id;
    const { id: productId } = req.params;

    const data = await Cart.update(
      {
        quantity,
      },
      {
        where: {
          productId,
          userId,
        },
      }
    );
    res.status(200).json({
      message: "successfully updated the data",
      data,
    });
  }
}
export default new CartController();
