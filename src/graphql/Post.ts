import { objectType, extendType, nonNull, stringArg } from 'nexus';
import { Post } from '../entity/Post';
import { Context } from '../types/Context';
import { User } from '../entity/User';
import { AuthenticationError } from '../helpers/error-handlers-helpers';

export const PostType = objectType({
  name: 'Post',
  definition(t) {
    t.nonNull.int('id');
    t.nonNull.string('title');
    t.nonNull.string('body');
    t.nonNull.boolean('published');
    t.int('creatorId'); 
    t.field('createdBy', {
      type: 'User',
      resolve(parent, _args, _context: Context, _info): Promise<User | null> {
        return User.findOne({ where: { id: parent.creatorId as undefined } }) ;
      }
    });
  },
});

export const PostQuery = extendType({
  type: 'Query',
  definition(t) {
    t.nonNull.list.field('drafts', {
      type: 'Post',
      resolve(_parent, _args, context: Context, _info): Promise<Post[]> {
        return context.db.query(`SELECT * FROM post WHERE published = false`);
      }
    });
  },
});

export const CreatePost = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('createDraft', {
      type: 'Post',
      args: {
        title: nonNull(stringArg()),
        body: nonNull(stringArg())
      },
      resolve(_parent, args, context: Context, _info): Promise<Post> {
        const { title, body } = args;
        const { userId } = context;

        if (!userId) {
          const error = new AuthenticationError('Login to create post')
          throw error;
        }

        return Post.create({
          title,
          body,
          published: false,
          creatorId: userId
        }).save()

      }
    });
  },
});
