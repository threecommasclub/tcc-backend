import { IResolvers } from "graphql-tools";
import * as bcrypt from 'bcryptjs';

import { User } from "./entity/User";

export const resolvers = {
  Query: {
    test: () => "test"
  },
  Mutation: {
    register: async (_: any, { email, password }: any) => {
      const passwordHash = await bcrypt.hash(password, 12);
      await User.create({
        email,
        password: passwordHash
      }).save();

      return true;
    },
    login: async (_: any, { email, password }) => {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return null;
      }

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        return null;
      }

      return user;
    }
  }
}
