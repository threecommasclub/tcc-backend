import { Resolver, Query, Ctx, Arg, Mutation, UseMiddleware } from 'type-graphql';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getConnection } from 'typeorm';

import { User, LoginResponse, LoginInput } from '../entities';
import { Context } from '../types/context';
import { isAuthenticated, authorized } from '../middleware/auth.middleware';
import { createRefreshToken, createAccessToken } from '../utils/auth.utils';
import { sendRefreshToken } from '../utils/auth.utils';

// TODO: lint
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
@Resolver()
export class UserResolver {
  @Query(() => User, { nullable: true })
  async me(@Ctx() ctx: Context): Promise<User | undefined> {
    const authorization = ctx.req.headers['authorization'];

    if (!authorization) {
      return undefined;
    }

    try {
      const token = authorization.split(' ')[1];
      const payload: any = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!);
      return User.findOne(payload.userId);
    } catch (err) {
      console.log(err);
      return undefined;
    }
  }

  @Query(() => [User])
  users() {
    return User.find();
  }

  @Mutation(() => LoginResponse)
  async login(@Arg('input') input: LoginInput, @Ctx() { res }: Context): Promise<LoginResponse> {
    const { email, password } = input;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new Error('could not find user');
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      throw new Error('invalid password');
    }

    sendRefreshToken(res, createRefreshToken(user));

    return {
      accessToken: createAccessToken(user),
      user,
    };
  }

  @Mutation(() => Boolean)
  async logout(@Ctx() { res }: Context) {
    sendRefreshToken(res, '');
    return true;
  }

  @Mutation(() => Boolean)
  async revokeRefreshTokensForUser(@Arg('userId', () => String) userId: string) {
    await getConnection()
      .getRepository(User)
      .increment({ id: userId }, 'tokenVersion', 1);

    return true;
  }

  // test
  @Query()
  @UseMiddleware(isAuthenticated)
  authedQuery(@Ctx() { user }: Context): string {
    console.log(user);
    return 'Only for authed users!';
  }

  // test
  @Query()
  @UseMiddleware(isAuthenticated, authorized('ADMIN'))
  authorizedQuery(@Ctx() { user }: Context): string {
    console.log(user);
    return 'Only for ADMIN!';
  }
}
