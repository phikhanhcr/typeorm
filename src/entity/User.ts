import {Entity, ObjectIdColumn, ObjectID, Column, OneToMany, OneToOne, JoinColumn, BaseEntity} from "typeorm";
import { Book } from "./Book";
@Entity()
export class User extends BaseEntity{

    @ObjectIdColumn()
    id: ObjectID;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    age: number;

    @OneToMany(() => Book, (book) => book.user)
    books: Book[]
}
