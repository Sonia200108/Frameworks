import { DataSource } from "typeorm";
import { Class } from "./entity/Classroom"; // Import your entities
import { Person } from "./entity/Person";
import { Family } from "./entity/Family";
import { Parent } from "./entity/Parent";
import { Child } from "./entity/Child";
import { Teacher } from "./entity/Teacher";


export const AppDataSource = new DataSource({
    type: "mysql",                  // or your database type
    host: "localhost",              // your database host
    port: 3306,                     // your database port
    username: "root",               // your database username
    password: "root",           // your database password
    database: "school",      // your database name
    synchronize: true,
    logging: false,
    entities: [Class, Person, Family, Parent, Child, Teacher], // Specify your entities here
    migrations: [], //"src/migrations/**/*.ts"
    subscribers: [],
});
