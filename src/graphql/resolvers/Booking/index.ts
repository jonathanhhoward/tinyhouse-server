import { IResolvers } from "apollo-server-express";
import { id, listing } from "./Booking";

export const bookingResolvers: IResolvers = {
  Booking: {
    id,
    listing,
  },
};
