import { IResolvers } from "apollo-server-express";
import { listing, listings } from "./Query";
import { hostListing } from "./Mutation";
import { id, host, bookingsIndex, bookings } from "./Listing";

export const listingResolvers: IResolvers = {
  Query: {
    listing,
    listings,
  },
  Mutation: {
    hostListing,
  },
  Listing: {
    id,
    host,
    bookingsIndex,
    bookings,
  },
};
