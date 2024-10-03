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
  tableName: "orders",
  modelName: "Order",
  timestamps: true,
})
class Order extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: UUIDV4,
  })
  declare id: string;
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    validate: {
      len: {
        args: [10, 10],
        msg: "phoneNumber must be of 10 digit",
      },
    },
  })
  declare phoneNumber: number;
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare shippingAddress: string;
  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  declare totalAmount: number;
  @Column({
    type: DataType.ENUM(
      "pending",
      "cancelled",
      "delivered",
      "ontheway",
      "preparation"
    ),
    defaultValue: "pending",
  })
  declare orderStatus: string;
}
export default Order;
