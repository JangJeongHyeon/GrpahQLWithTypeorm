import {Entity, PrimaryGeneratedColumn, Column, BaseEntity} from "typeorm";

@Entity()
export class User extends BaseEntity{

    @PrimaryGeneratedColumn() 
    id: number;

    @Column({type: "varchar", length: "230", unique: true})
    email: string;

    @Column({type: "bool", default: false})
    confirm: boolean;

    @Column({type: "varchar", length: "230"})
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    age: number;

}
