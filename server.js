import { ApolloServer, gql } from "apollo-server";
import { ApolloServerPluginLandingPageGraphQLPlayground as playGround } from "apollo-server-core";
import { users, quotes } from "./db.js";
const typeDefs = gql`
  type Query {
    getusers: [User]
    user(id: ID!): User
    quotes: [Quote]
    iquote(by: ID!): [Quote]
  }
  type User {
    id: ID
    email: String
    name: String
    password: String
    quotes: [Quote]
  }

  type Quote {
    name: String
    by: ID
  }
`;

const resolvers = {
  Query: {
    getusers: () => users,
    quotes: () => quotes,
    user: (_, args) => users.find((user) => user.id == args.id),
    iquote: (_, { by }) => quotes.filter((quote) => quote.by == by),
  },

  User: {
    quotes: (ur) => quotes.filter((quote) => quote.by == ur.id),
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [playGround()],
});

server.listen().then(({ url }) => {
  console.log(`Server is ready at ${url}`);
});
