import { ApolloServer, gql } from 'apollo-server';
import "reflect-metadata";
import { createConnection, getConnection } from 'typeorm';
import { ResolverMap } from './types/ResolverTypes';
import { User } from './entity/User';

const typeDefs = gql`
  type User{
    id: Int!
    firstName: String!
    lastName: String!
    age: Int!
    email: String!
  }

  type Query{
    hello(name: String): String!
    user(id: Int!): User!
    users: [User!]!
  }

  type Mutation{
    createUser(firstName: String!, lastName: String!, age: Int!, email: String!): User!
    updateUser(id: Int!, firstName: String, lastName: String, age: Int, email: String): Boolean!
    deleteUser(id: Int!): Boolean!
  }
`;

const resolvers: ResolverMap = {
  Query: {
    hello: (_: any, { name }: any) => `Hello ${name || 'world'}`,
    user: (_, { id }) => User.findOne({ id }),
    users: () => User.find(),
  },

  Mutation: {
    createUser: (_, args) => User.create(args).save(),
    updateUser: (_, args) => {
      try {
        User.update({ id: args.id }, args);
        return true;
      } catch (err) {
        console.log(err);
      }
      return false;
    },
    deleteUser: (_, { id }) => {
      try {
        // User.delete(id);

        // Change above code to querybuilder 
        getConnection().createQueryBuilder().delete().from(User).where("id = :id", { id }).execute();
        return true;
      } catch (err) {
        console.log(err);
      }
      return false;
    }
  }
}
const server = new ApolloServer({ typeDefs, resolvers });

createConnection().then(() => {
  server.listen().then(({ url }) => {
    console.log(`Server Start At ${url}`);
  })
})
