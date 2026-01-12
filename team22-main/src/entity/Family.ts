import { Entity, PrimaryGeneratedColumn, OneToOne, OneToMany, JoinColumn } from "typeorm";
import { Parent } from "./Parent";
import { Child } from "./Child";

@Entity()
export class Family {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => Parent, (parent) => parent.family, {
        onDelete: 'SET NULL'  // When family is deleted, set parent's reference to null
    })
    @JoinColumn()
    parent1: Parent;

    @OneToOne(() => Parent, (parent) => parent.family, {
        onDelete: 'SET NULL'  // When family is deleted, set parent's reference to null
    })
    @JoinColumn()
    parent2: Parent;

    @OneToMany(() => Child, (child) => child.family, {
        onDelete: 'CASCADE'  // When family is deleted, delete all children
    })
    children: Child[];
}