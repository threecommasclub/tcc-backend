import { Resolver, Arg, Mutation } from 'type-graphql';
import bcrypt from 'bcryptjs';
import uuid from 'uuid';
import dayjs from 'dayjs';

import { User, RegisterInput, EmailVerification } from '../entities';

@Resolver()
export class RegisterResolver {
  @Mutation(() => User)
  async register(@Arg('input') input: RegisterInput) {
    const hashedPassword = await bcrypt.hash(input.password, 12);
    try {
      const result = await User.insert({
        email: input.email,
        password: hashedPassword,
        verified: false,
      });

      const user = await User.findOne({ id: result.identifiers[0].id });

      if (user) {
        // generate email verification
        await EmailVerification.insert({
          userId: user.id,
          verificationCode: uuid.v4(),
          expiryDate: dayjs()
            .add(6, 'minute')
            .toDate(),
          enabled: true,
        });
      }

      return user;
    } catch (err) {
      console.log(err);
      throw new Error('register was failed');
    }
  }
}
