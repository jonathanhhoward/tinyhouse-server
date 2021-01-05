import { IResolvers } from "apollo-server-express";
import { authUrl } from "./Query";
import { logIn, logOut, connectStripe, disconnectStripe } from "./Mutation";
import { id, hasWallet } from "./Viewer";

export const viewerResolvers: IResolvers = {
  Query: {
    authUrl,
  },
  Mutation: {
    logIn,
    logOut,
    connectStripe,
    disconnectStripe,
  },
  Viewer: {
    id,
    hasWallet,
  },
};
