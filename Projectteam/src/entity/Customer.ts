import { ChildEntity, OneToOne, OneToMany, JoinColumn, Column } from "typeorm";
import { User } from "./User";
import { Profile } from "./Profile";
import { Order } from "./Order";

@ChildEntity()
export class Customer extends User {
  @Column({ default: true })
  isActive!: boolean;
  @OneToOne(() => Profile, (profile) => profile.customer, { cascade: true })
  @JoinColumn()
  profile!: Profile;

  @OneToMany(() => Order, (order) => order.customer)
  orders!: Promise<Order[]>;
}