import { IResolvers } from "apollo-server-express";
import { listing, listings } from "./Query";
import { id, host, bookingsIndex, bookings } from "./Listing";

export const listingResolvers: IResolvers = {
  Query: {
    listing,
    listings,
  },
  Listing: {
    id,
    host,
    bookingsIndex,
    bookings,
  },
};
