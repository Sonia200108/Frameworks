import { ChildEntity, Column } from "typeorm";
import { User } from "./User";

@ChildEntity()
export class Admin extends User {
  @Column()
  permissions!: string;
}