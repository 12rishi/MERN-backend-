import { Sequelize } from "sequelize-typescript";
import User from "./models/userModel";
import Product from "./models/productModel";
import Category from "./models/categoryModel";
import Cart from "./models/cartModel";

const sequelize = new Sequelize({
  database: process.env.DB_NAME,
  dialect: "mysql",
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD || "",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT),
  models: [__dirname + "/models"],
});

sequelize
  .authenticate()
  .then(() => {
    console.log("connected");
  })
  .catch((err) => {
    console.log(err);
  });

sequelize.sync({ force: false }).then(() => {
  console.log("synced !!!");
});
User.hasMany(Product, { foreignKey: "userId" });
Product.belongsTo(User, { foreignKey: "userId" });
Product.belongsTo(Category, { foreignKey: "categoryId" });
Category.hasOne(Product, { foreignKey: "categoryId" });
Product.hasMany(Cart, { foreignKey: "productId" });
Cart.belongsTo(Product, { foreignKey: "productId" });
User.hasMany(Cart, { foreignKey: "userId" });
Cart.belongsTo(User, { foreignKey: "userId" });
