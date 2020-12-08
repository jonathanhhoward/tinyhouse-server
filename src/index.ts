// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config();

import express, { Application } from "express";
import cookieParser from "cookie-parser";
import { ApolloServer } from "apollo-server-express";
import { connectDatabase } from "./database";
import { typeDefs, resolvers } from "./graphql";

async function mount(app: Application) {
  const db = await connectDatabase();

  app.use(cookieParser(process.env.SECRET));

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req, res }) => ({ db, req, res }),
  });
  server.applyMiddleware({ app, path: "/api" });

  app.listen(process.env.PORT, () => {
    console.log("[app]: http://localhost:9000/api");
  });
}

mount(express()).catch(console.error);
