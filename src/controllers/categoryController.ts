import { Request, Response } from "express";
import Category from "../database/models/categoryModel";

class CategoryController {
  categories = [
    { categoryName: "Electronics" },
    { categoryName: "Groceries" },
    { categoryName: "Food/Beverages" },
  ];
  async seedCategory(): Promise<void> {
    const [data] = await Category.findAll();
    if (!data) {
      await Category.bulkCreate(this.categories);
      console.log("successfully stored the category");
      return;
    }
    return;
  }
  async addCategory(req: Request, res: Response): Promise<void> {
    const { categoryName } = req.body;
    if (!categoryName) {
      res.status(400).json({
        message: "please provide categoryName",
      });
      return;
    }
    const data = await Category.create({
      categoryName,
    });
    res.status(201).json({
      message: "successfully created",
    });
    return;
  }
  async findCategory(req: Request, res: Response): Promise<void> {
    const data = await Category.findAll();
    res.status(200).json({
      message: "successfully foun dthe data",
      data: data,
    });
    return;
  }
  async deleteCategory(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({
        message: "please provide the category to be deleted",
      });
      return;
    }
    await Category.destroy({
      where: {
        id,
      },
    });
    res.status(204).json({
      message: "successfully deleted the item",
    });
  }
  async updateCategory(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { categoryName } = req.body;
    if (!id) {
      res.status(400).json({
        message: "please provide teh category to be updated",
      });
      return;
    }
    await Category.update(
      {
        categoryName,
      },
      {
        where: {
          id,
        },
      }
    );
    res.status(204).json({
      message: "successfully updated the data ",
    });
    return;
  }
}
export default new CategoryController();
