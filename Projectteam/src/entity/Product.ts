import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany } from "typeorm";
import { Category } from "./Category";
import { Order } from "./Order";

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column("float")
  price!: number;

  @Column()
  stock!: number;

  @ManyToOne(() => Category, (category) => category.products)
  category!: Category;

  @ManyToMany(() => Order, (order) => order.products)
  orders!: Order[];
}