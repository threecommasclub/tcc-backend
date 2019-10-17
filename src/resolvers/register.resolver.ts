import { Resolver, Arg, Mutation } from 'type-graphql';
import bcrypt from 'bcryptjs';
import uuid from 'uuid';
import dayjs from 'dayjs';

import { User, RegisterInput, EmailVerification } from '../entities';
import { MailService } from '../services/mail.service';

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
        const verificationCode = uuid.v4();
        const expiryDate = dayjs()
          .add(6, 'minute')
          .toDate();
        await EmailVerification.insert({
          userId: user.id,
          verificationCode,
          expiryDate,
          enabled: true,
        });

        // TODO: send a confirm email
        const mailService = new MailService();
        await mailService.sendMail(user.email, 'title', `content with token url, ${verificationCode}, ${expiryDate}`);
      }

      return user;
    } catch (err) {
      console.log(err);
      throw new Error('register was failed');
    }
  }
}
