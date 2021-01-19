import { IResolvers } from "apollo-server-express";
import { createBooking } from "./Mutaion";
import { id, listing } from "./Booking";

export const bookingResolvers: IResolvers = {
  Mutation: {
    createBooking,
  },
  Booking: {
    id,
    listing,
  },
};
