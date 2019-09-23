import { Resolver, Query, Ctx, Arg, Mutation } from 'type-graphql';
import { Request, Response } from 'express';
import { hash, compare } from 'bcryptjs';

import { User, LoginResponse } from '../entities';

@Resolver()
export class UserResolver {
  @Query(() => User, { nullable: true })
  me(@Ctx() context: MyContext) {
    const authorization = context.req.headers['authorization'];

    if (!authorization) {
      return null;
    }

    try {
      // const token = authorization.split(' ')[1];
      // const payload: any = verify(token, process.env.ACCESS_TOKEN_SECRET!);
      // return User.findOne(payload.userId);
      return null;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  @Query(() => [User])
  users() {
    return User.find();
  }

  @Mutation(() => LoginResponse)
  async login(
    @Arg('email') email: string,
    @Arg('password') password: string
    // @Ctx() { res }: MyContext
  ): Promise<LoginResponse> {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new Error('could not find user');
    }

    const valid = await compare(password, user.password);

    if (!valid) {
      throw new Error('bad password');
    }

    // login successful

    // sendRefreshToken(res, createRefreshToken(user));

    // return {
    //   accessToken: createAccessToken(user),
    //   user,
    // };
    throw new Error('successful');
  }

  @Mutation(() => Boolean)
  async register(@Arg('email') email: string, @Arg('password') password: string) {
    const hashedPassword = await hash(password, 12);

    try {
      await User.insert({
        email,
        password: hashedPassword,
      });
    } catch (err) {
      console.log(err);
      return false;
    }

    return true;
  }
}

export interface MyContext {
  req: Request;
  res: Response;
  payload?: { userId: string };
}
