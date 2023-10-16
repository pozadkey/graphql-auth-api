import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from "typeorm";
  import { User } from "./User";
  
  @Entity()
  export class Post extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;
  
    @Column()
    title!: string;
  
    @Column()
    body!: string;
  
    @Column()
    published!: boolean;
  
    @Column({ nullable: true })
creatorId: number | undefined;

  
    @ManyToOne(() => User, (user) => user.posts)
    creator!: User;
  
    @CreateDateColumn()
    createdAt!: Date;
  
    @UpdateDateColumn()
    updatedAt!: Date;
  }
  