import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from "typeorm";
import { Customer } from "./Customer";

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  address!: string;

  @Column()
  phone!: string;

  @OneToOne(() => Customer, (customer) => customer.profile)
  customer!: Customer;
}