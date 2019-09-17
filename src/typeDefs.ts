import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  # TODO: unique email
  type User {
    id: ID!
    email: String!
  }

  type Query {
    me: User
  }

  type Mutation {
    register(email: String!, password: String!): Boolean!
    login(email: String!, password: String!): User
  }
`;
