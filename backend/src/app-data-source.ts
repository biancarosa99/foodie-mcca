import { DataSource } from "typeorm";
require("dotenv").config();

export const myDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: process.env.PG_PASS,
  database: "foodie",
  entities: ["src/entities/**/*.ts"],
  logging: true,
  synchronize: true,
  migrationsTableName: "custom_migration_table",
  migrations: ["src/migrations/*.ts"],
  migrationsRun: true,
});
