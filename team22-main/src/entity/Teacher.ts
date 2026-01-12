import { Entity, OneToOne, JoinColumn } from "typeorm";
import { Person } from "./Person";
import { Class } from "./Classroom";

// Teacher entity that inherits from Person
@Entity()
export class Teacher extends Person {
    @OneToOne(() => Class, (klass) => klass.teacher, { cascade: false }) // No cascade
    @JoinColumn()
    klass: Class;
}
