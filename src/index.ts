import { ApolloServer } from 'apollo-server-express';
import { createConnection } from 'typeorm';
import express from 'express';
import { buildSchema } from 'type-graphql';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { UserResolver, CompanyResolver } from './resolvers';
import { getUserFromToken, refreshAccessToken } from './utils/auth.utils';

require('dotenv').config();

(async () => {
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver, CompanyResolver],
      emitSchemaFile: './src/generated/schema.gql',
    }), // TODO: add authchecker
    context: async ({ req, res }) => {
      const token = req.headers.authorization;
      if (!token) {
        return { req, res };
      }
      const user = getUserFromToken(token);
      return { req, res, user };
    },
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

  // TODO: change to graphql
  app.post('/refresh-token', refreshAccessToken);

  apolloServer.applyMiddleware({ app });

  app.listen({ port: 4000 }, () => console.log(`🚀  Server ready at http://localhost:4000${apolloServer.graphqlPath}`));
})();
