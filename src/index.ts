import { ApolloServer } from 'apollo-server-express';
import { createConnection } from 'typeorm';
import express from 'express';
import { buildSchema } from 'type-graphql';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';

import { UserResolver, CompanyResolver } from './resolvers';
import { User } from './entities/user';
import { createAccessToken, createRefreshToken } from './utils/auth/jwt';

require('dotenv').config();

// TODO: refactor with a new controller
const sendRefreshToken = (res: express.Response, token: string) => {
  res.cookie('jid', token, {
    httpOnly: true,
    path: '/refresh-token',
  });
};

// TODO: lint
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
(async () => {
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver, CompanyResolver],
    }), // TODO: add authchecker
    context: ({ req, res }) => ({ req, res }),
  });

  await createConnection();

  const app = express();
  app.use(
    cors({
      credentials: true,
      // origin: 'http://localhost:3000', // TODO: set
    })
  );
  app.use(cookieParser());

  // TODO: refactor with a new controller
  app.post('/refresh-token', async (req, res) => {
    const token = req.cookies.jid;
    if (!token) {
      return res.send({ ok: false, accessToken: '' });
    }
    let payload: any = null;
    try {
      payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!);
    } catch (err) {
      console.log(err);
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
  });

  apolloServer.applyMiddleware({ app });

  app.listen({ port: 4000 }, () => console.log(`🚀  Server ready at http://localhost:4000${apolloServer.graphqlPath}`));
})();
