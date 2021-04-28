import { createConnection } from "typeorm";
import { dbName, dbType, __process__ } from "../utils/setup";
import path from "path";

export default {
  type: dbType,
  username: __process__.db_user,
  password: __process__.db_pass,
  database: dbName,
  synchronize: true,
  logging: false,
  dropSchema: false,
  migrations: [path.join(__dirname, "../typeorm/migrations/*.ts")],
  subscribers: [path.join(__dirname, "../typeorm/subscribers/*.ts")],
  entities: [path.join(__dirname, "../typeorm/entity/*.ts")],
} as Parameters<typeof createConnection>[0];
