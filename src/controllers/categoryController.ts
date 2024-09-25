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
}
export default new CategoryController();
