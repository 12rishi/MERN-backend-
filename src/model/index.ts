import { Sequelize, DataTypes } from "sequelize";
import dbConfig from "../config/dbConfig";
const sequelize = new Sequelize(dbConfig.db, dbConfig.user, dbConfig.password, {
  host: dbConfig.host,
  dialect: dbConfig.dialect,
  port: 3306,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});
sequelize
  .authenticate()
  .then(() => console.log("connected!"))
  .catch((error) => console.log(error?.message));
const db: any = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.sequelize.sync({ force: false }).then(() => {
  console.log("migrated");
});
export default db;
