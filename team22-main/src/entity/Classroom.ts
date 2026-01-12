import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne } from "typeorm";
import { Child } from "./Child";
import { Teacher } from "./Teacher";

// Class entity
@Entity()
export class Class {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    year: number;

    @Column()
    className: string;

    @OneToMany(() => Child, (child) => child.klass, { cascade: false }) // No cascade
    children: Child[];

    @OneToOne(() => Teacher, (teacher) => teacher.klass)
    teacher: Teacher;
}
