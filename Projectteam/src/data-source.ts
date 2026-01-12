import { DataSource } from "typeorm";

import { User } from "./entity/User";
import { Customer } from "./entity/Customer";
import { Admin } from "./entity/Admin";
import { Profile } from "./entity/Profile";
import { Category } from "./entity/Category";
import { Product } from "./entity/Product";
import { Order } from "./entity/Order";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "team24",
  password: "team24",
  database: "frameworks_db",
  synchronize: true,
  logging: true,
  entities: [User, Customer, Admin, Profile, Category, Product, Order ],
});