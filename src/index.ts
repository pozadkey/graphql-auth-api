import { ApolloServer } from "apollo-server";
import { schema } from "./schema";
import typeormConfig from "./typeorm.config";
import "reflect-metadata";
import { Context } from "./types/Context";
import { auth } from "./middlewares/auth";

const bootServer = async () => {
  try {
    const db = await typeormConfig.initialize(); 

    console.log(`Connected to database`);

    const server = new ApolloServer({
      schema,
      context: ({ req }): Context => {
        const token = req?.headers?.authorization
        ? auth(req.headers.authorization) 
        : null;  
        return { db, userId: token?.userId }
      },
      formatError: (error) => {
        const statusCode = (error.originalError as any)?.statusCode || 500; 
        return {
          message: error.message,
          extensions: {
            statusCode: statusCode, 
          },
        };
      },
    });

    server.listen(5000).then(({ url }) => {
      console.log(`Server is running at ${url}`);
    });
  } catch (err) {
    console.log(err);
  }
};

bootServer();
