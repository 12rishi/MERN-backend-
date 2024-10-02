import { STRING } from "sequelize";
import { UUIDV4 } from "sequelize";
import {
  Column,
  Table,
  DataType,
  Model,
  AllowNull,
} from "sequelize-typescript";
@Table({
  tableName: "orderdetails",
  modelName: "OrderDetail",
  timestamps: true,
})
class OrderDetail extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: UUIDV4,
  })
  declare id: string;
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare quantity: number;
}
export default OrderDetail;
