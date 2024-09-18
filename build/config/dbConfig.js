"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dbConfig = {
    host: "localhost",
    password: "",
    user: "root",
    db: "MERNBackend",
    dialect: "mysql",
    pool: {
        max: 5,
        min: 0,
        acquire: 10000,
        idle: 10000,
    },
};
exports.default = dbConfig;
