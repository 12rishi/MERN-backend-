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
  tableName: "users",
  modelName: "User",
  timestamps: true,
})
class User extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;
  @Column({
    type: DataType.STRING,
  })
  declare userName: string;
  @Column({
    type: DataType.STRING,
  })
  declare email: string;
  @Column({
    type: DataType.STRING,
  })
  declare password: string;
  @Column({
    type: DataType.ENUM("admin", "customer"),
    defaultValue: "customer",
  })
  declare role: string;
}
export default User;
