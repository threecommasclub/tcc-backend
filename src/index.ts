import { ApolloServer } from 'apollo-server-express';
import { createConnection } from 'typeorm';
import express from 'express';
import session from 'express-session';
import { buildSchema } from 'type-graphql';

import { UserResolver, CompanyResolver } from './resolvers';

require('dotenv').config();

(async () => {
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver, CompanyResolver],
    }),
    context: ({ req, res }) => ({ req, res }),
  });

  await createConnection();

  const app = express();

  app.use(
    session({
      secret: 'tcc_secret',
      resave: false,
      saveUninitialized: false,
    })
  );

  apolloServer.applyMiddleware({ app });

  app.listen({ port: 4000 }, () => console.log(`🚀  Server ready at http://localhost:4000${apolloServer.graphqlPath}`));
})();
