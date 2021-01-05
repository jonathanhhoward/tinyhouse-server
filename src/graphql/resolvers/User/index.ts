import { IResolvers } from "apollo-server-express";
import { user } from "./Query";
import { id, hasWallet, income, bookings, listings } from "./User";

export const userResolvers: IResolvers = {
  Query: {
    user,
  },
  User: {
    id,
    hasWallet,
    income,
    bookings,
    listings,
  },
};
