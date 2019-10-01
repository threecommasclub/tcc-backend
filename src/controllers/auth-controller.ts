import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { createAccessToken, createRefreshToken } from '../utils/auth/jwt';
import { User } from '../entities/user';

export const sendRefreshToken = (res: Response, token: string) => {
  res.cookie('jid', token, {
    httpOnly: true,
    path: '/refresh-token',
  });
};

interface Payload {
  userId?: string;
  accessToken?: string;
  tokenVersion?: number;
}

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
    console.log(err);
    return res.send({ ok: false, accessToken: '' });
  }
};
