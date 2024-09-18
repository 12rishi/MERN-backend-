type Database = {
  host: string;
  password: string;
  user: string;
  db: string;
  dialect: "mysql" | "postgres" | "sqlite";
  pool: {
    max: number;
    min: number;
    idle: number;
    acquire: number;
  };
};
const dbConfig: Database = {
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
export default dbConfig;
