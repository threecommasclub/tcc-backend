import { IResolvers } from 'graphql-tools';
import * as bcrypt from 'bcryptjs';

import { User } from './entity/User';

export const resolvers: IResolvers = {
  Query: {
    me: (_, __, { req }) => {
      if (!req.session.userId) {
        return null;
      }
      return User.findOne(req.session.userId);
    },
  },
  Mutation: {
    register: async (_, { email, password }) => {
      // TODO:
      const passwordHash = await bcrypt.hash(password, 12);
      await User.create({
        email,
        password: passwordHash,
      }).save();

      return true;
    },
    login: async (_, { email, password }, { req }) => {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return null;
      }

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        return null;
      }

      req.session.userId = user.id;

      return user;
    },
  },
};
