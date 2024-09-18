"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const dbConfig_1 = __importDefault(require("../config/dbConfig"));
const sequelize = new sequelize_1.Sequelize(dbConfig_1.default.db, dbConfig_1.default.user, dbConfig_1.default.password, {
    host: dbConfig_1.default.host,
    dialect: dbConfig_1.default.dialect,
    port: 3306,
    pool: {
        max: dbConfig_1.default.pool.max,
        min: dbConfig_1.default.pool.min,
        acquire: dbConfig_1.default.pool.acquire,
        idle: dbConfig_1.default.pool.idle,
    },
});
sequelize
    .authenticate()
    .then(() => console.log("connected!"))
    .catch((error) => console.log(error === null || error === void 0 ? void 0 : error.message));
const db = {};
db.Sequelize = sequelize_1.Sequelize;
db.sequelize = sequelize;
db.sequelize.sync({ force: false }).then(() => {
    console.log("migrated");
});
exports.default = db;
