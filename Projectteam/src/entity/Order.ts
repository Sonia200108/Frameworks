import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable } from "typeorm";
import { Customer } from "./Customer";
import { Product } from "./Product";

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  date!: Date;

  @Column("float")
  total!: number;

  @ManyToOne(() => Customer, (customer) => customer.orders)
  customer!: Customer;

  @ManyToMany(() => Product, (product) => product.orders)
  @JoinTable()
  products!: Product[];
}