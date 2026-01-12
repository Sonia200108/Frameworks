import { Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { Person } from "./Person";
import { Family } from "./Family";

// Parent entity that inherits from Person
@Entity()
export class Parent extends Person {
    @OneToOne(() => Family, (family) => family.parent1)
    family: Family;
}