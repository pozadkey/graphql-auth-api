import { extendType, nonNull, objectType, stringArg } from 'nexus';
import { Context } from '../types/Context';
import argon2 from 'argon2';
import { User } from '../entity/User';
import * as jwt from 'jsonwebtoken';
import { AuthenticationError, ValidationError } from '../helpers/error-handlers-helpers';

export const AuthType = objectType({
  name: 'AuthType',
  definition(t) {
    t.nonNull.string('token');
    t.nonNull.field('user', {
      type: 'User',
    });
  },
});

export const AuthMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('login', {
      type: 'AuthType',
      args: {
        username: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      async resolve (_parent, args, _context: Context, _info) {
        const { username, password } = args;
        const user = await User.findOne( {  where:  { username }});

        if(!user){
          const error = new ValidationError('User does not exist')
          throw error
        }

        const isPasswordValid = await argon2.verify(user.password, password)

        if(!isPasswordValid){
          const error = new AuthenticationError('Password is incorrect')
          throw error
        }

        const token = jwt.sign({userId: user.id}, process.env.TOKEN_SECRET as jwt.Secret)

        return {
          token, 
          user
        }
      }
    });

    t.nonNull.field('register', {
      type: 'AuthType',
      args: {
        username: nonNull(stringArg()),
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      async resolve (_parent, args, context: Context, _info) {
        const { username, email, password } = args;
        const hashedPassword = await argon2.hash(password);
        let user;
        let token;

        try {
          const result = await context.db
            .createQueryBuilder()
            .insert()
            .into(User)
            .values({ username, email, password: hashedPassword })
            .returning('*')
            .execute();

          user = result.raw[0];
          token = jwt.sign({ userId: user.id }, process.env.TOKEN_SECRET as jwt.Secret);
        } catch (err) {
          console.log(err);
          const error = new ValidationError('Registration failed')
          throw error
        }

        if (!user || !token) {
          const error = new ValidationError('Registration failed')
          throw error
        }

        return {
          token,
          user,
        };
      },
    });
  },
});
