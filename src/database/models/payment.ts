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
  tableName: "payments",
  modelName: "Payment",
  timestamps: true,
})
class Payment extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: UUIDV4,
  })
  declare id: string;
  @Column({
    type: DataType.ENUM("cod", "esewa", "khalti"),
    allowNull: false,
  })
  declare paymentMethod: string;
  @Column({
    type: DataType.ENUM("paid", "unpaid"),
    defaultValue: "unpaid",
  })
  declare paymentStatus: string;
  @Column({
    type: DataType.STRING,
  })
  declare pidx: string;
}
export default Payment;
