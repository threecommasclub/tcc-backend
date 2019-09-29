import { ApolloServer } from 'apollo-server-express';
import { createConnection } from 'typeorm';
import express from 'express';
import session from 'express-session';
import { buildSchema } from 'type-graphql';
import connectRedis from 'connect-redis';
import cors from 'cors';

import { UserResolver, CompanyResolver } from './resolvers';
import { redis } from './redis';

require('dotenv').config();

/* eslint-disable @typescript-eslint/no-explicit-any */
(async () => {
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver, CompanyResolver],
    }),
    context: ({ req, res }) => ({ req, res }),
  });

  await createConnection();

  const app = express();

  const RedisStore = connectRedis(session);

  app.use(
    cors({
      credentials: true,
      // origin: 'http://localhost:3000', // TODO: set
    })
  );

  app.use(
    session({
      name: 'qid',
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24 * 7 * 365, // 7 years
      },
      store: new RedisStore({
        client: redis as any,
      }),
    } as any)
  );

  apolloServer.applyMiddleware({ app });

  app.listen({ port: 4000 }, () => console.log(`🚀  Server ready at http://localhost:4000${apolloServer.graphqlPath}`));
})();
