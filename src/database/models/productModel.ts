import { UUIDV4 } from "sequelize";
import {
  Table,
  Column,
  CreatedAt,
  Model,
  DataType,
  PrimaryKey,
} from "sequelize-typescript";
@Table({
  tableName: "products",
  modelName: "Product",
  timestamps: true,
})
class Product extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare productName: string;
  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  declare productDescription: string;
  @Column({
    type: DataType.INTEGER,
  })
  declare productPrice: number;
  @Column({
    type: DataType.INTEGER,
  })
  declare productQty: number;
  @Column({
    type: DataType.STRING,
  })
  declare productImageUrl: string;
}
export default Product;
