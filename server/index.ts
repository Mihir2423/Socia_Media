import { ApolloServer } from "apollo-server";
import { typeDefs } from "./schema/typeDefs";
import resolvers from "./schema/resolvers/index";
import { Connection } from "./database/db";

const server = new ApolloServer({ typeDefs, resolvers, context: ({ req }) => ({ req }) });

Connection();

server.listen({ port: 3002 }).then(({ url } : {url : String} ) => {
  console.log(`Your api is running at : ${url}`);
});
