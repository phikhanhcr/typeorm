import {Entity, ObjectIdColumn, ObjectID, Column, OneToOne, JoinColumn, ManyToOne, BaseEntity} from "typeorm";
import { User } from "./User";
@Entity()
export class Book extends BaseEntity {

    @ObjectIdColumn()
    id: ObjectID;

    @Column()
    name: string;

    // @Column()
    // authorId: string;

    @ManyToOne(() => User, user => user.books)
    user: User
}
