import { Entity, ManyToOne } from "typeorm";
import { Person } from "./Person";
import { Family } from "./Family";
import { Class } from "./Classroom";

@Entity()
export class Child extends Person {
    @ManyToOne(() => Family, (family) => family.children, {
        onDelete: 'CASCADE'  // When family is deleted, this child will be deleted
    })
    family: Family;

    @ManyToOne(() => Class, (klass) => klass.children, { 
        lazy: true,
        onDelete: 'SET NULL'  // When class is deleted, set reference to null
    })
    klass: Promise<Class>;
    child: Family[];
}