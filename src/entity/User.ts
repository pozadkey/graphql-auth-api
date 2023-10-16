import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Post } from "./Post";

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column( { unique: true })
    username!: string; 

    @Column( { unique: true })
    email!: string;

    @Column()
    password!: string;

    @OneToMany(() => Post, (post) => post.creator)
    posts: Post[] | undefined;

    @CreateDateColumn()
    createdAt: Date | undefined; 

    @UpdateDateColumn()
    updatedAt: Date | undefined; 
}