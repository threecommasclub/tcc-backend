import { ApolloServer } from 'apollo-server-express';
import { createConnection } from 'typeorm';
import * as express from 'express';
import * as session from 'express-session';

import { typeDefs } from './typeDefs';
import { resolvers } from './resolvers';

const start = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }: any) => ({ req }),
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

  server.applyMiddleware({ app });

  app.listen({ port: 4000 }, () => console.log(`🚀  Server ready at http://localhost:4000${server.graphqlPath}`));
};

start();
