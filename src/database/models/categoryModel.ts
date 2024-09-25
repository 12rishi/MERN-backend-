import { UUIDV4 } from "sequelize";
import {
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";

@Table({
  tableName: "categories",
  modelName: "Category",
})
class Category extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: UUIDV4,
  })
  declare id: string;
  @Column({
    type: DataType.STRING,
  })
  declare categoryName: string;
}
export default Category;
