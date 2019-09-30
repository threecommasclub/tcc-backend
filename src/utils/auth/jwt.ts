import { User } from '../../entities/user';
import jwt from 'jsonwebtoken';

// TODO: lint
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

export const createAccessToken = (user: User) => {
  return jwt.sign({ userId: user.id }, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: '15m',
  });
};

export const createRefreshToken = (user: User) => {
  return jwt.sign(
    {
      userId: user.id,
      tokenVersion: user.tokenVersion,
    },
    process.env.REFRESH_TOKEN_SECRET!,
    {
      expiresIn: '7d',
    }
  );
};
