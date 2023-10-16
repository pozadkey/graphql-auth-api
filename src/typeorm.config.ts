import { DataSource } from "typeorm";
import dotenv from 'dotenv';
import { Post } from "./entity/Post";
import { User } from "./entity/User";

dotenv.config();

 export default new DataSource ({
    type: "postgres" ,
    url: process.env.CONNECTION_STRING,
    entities: [Post, User],
    synchronize: true,
 })