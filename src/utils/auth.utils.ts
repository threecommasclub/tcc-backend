import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { User } from '../entities/user';

interface Payload {
  userId?: string;
  accessToken?: string;
  tokenVersion?: number;
}

export const createAccessToken = (user: User) => {
  if (!process.env.ACCESS_TOKEN_SECRET) {
    throw new Error('ACCESS_TOKEN_SECRET undefiend');
  }
  return jwt.sign({ userId: user.id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '15m',
  });
};

export const createRefreshToken = (user: User) => {
  if (!process.env.REFRESH_TOKEN_SECRET) {
    throw new Error('REFRESH_TOKEN_SECRET undefiend');
  }
  return jwt.sign(
    {
      userId: user.id,
      tokenVersion: user.tokenVersion,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: '7d',
    }
  );
};

export const sendRefreshToken = (res: Response, token: string) => {
  res.cookie('jid', token, {
    httpOnly: true,
    path: '/refresh-token',
  });
};

export const refreshAccessToken = async (req: Request, res: Response) => {
  const token = req.cookies.jid;
  if (!token || !process.env.REFRESH_TOKEN_SECRET) {
    return res.send({ ok: false, accessToken: '' });
  }

  try {
    const payload: Payload | string = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    if (typeof payload === 'string') {
      return res.send({ ok: false, accessToken: '' });
    }
    // token is valid and send back an access token
    const user = await User.findOne({ id: payload.userId });
    if (!user) {
      return res.send({ ok: false, accessToken: '' });
    }
    if (user.tokenVersion !== payload.tokenVersion) {
      return res.send({ ok: false, accessToken: '' });
    }
    sendRefreshToken(res, createRefreshToken(user));
    return res.send({ ok: true, accessToken: createAccessToken(user) });
  } catch (err) {
    console.log('refreshAccessToken failed', err);
    return res.send({ ok: false, accessToken: '' });
  }
};
