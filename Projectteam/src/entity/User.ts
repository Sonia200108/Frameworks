import { Entity, PrimaryGeneratedColumn, Column, TableInheritance } from "typeorm";

@Entity()
@TableInheritance({ column: { type: "varchar", name: "role" } })
export abstract class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  email!: string;

  @Column({ nullable: true })
  role?: string; 
}