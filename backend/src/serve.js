import dotenv from 'dotenv';
dotenv.config();

import typeDefs from "./graphql/typeDefs.js";
import { startStandaloneServer } from '@apollo/server/standalone';
import { ApolloServer } from "@apollo/server";
import { mergeResolvers } from "@graphql-tools/merge";

import connectDB from "./config/db.js";
import userResolver from "./graphql/resolvers/userResolver.js";
import taskResolver from "./graphql/resolvers/taskResolver.js";
import getUserFromToken from "./middleware/auth.js";

// Conectar a la DB
connectDB();

const resolvers = mergeResolvers([userResolver, taskResolver]);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true, // Permite ver todo el schema en Sandbox
});

const PORT = process.env.PORT || 3001;

const { url } = await startStandaloneServer(server, {
  listen: { port: PORT },
  context: async ({ req }) => {
    const token = req.headers.authorization || '';
    const user = getUserFromToken(token);
    return { user };
  }
});

console.log(`Servidor GraphQL listo en ${url}`);
