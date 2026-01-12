import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

// Base entity for all people
@Entity()
export class Person {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    age: number;
}
