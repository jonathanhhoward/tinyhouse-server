import { IResolvers } from "apollo-server-express";
import { Request } from "express";
import { ObjectId } from "mongodb";
import { Database, Listing, User } from "../../../lib/types";
import { authorize } from "../../../lib/utils";
import { ListingArgs, ListingBookingsArgs, ListingBookingsData } from "./types";

export const listingResolvers: IResolvers = {
  Query: {
    async listing(
      _root: undefined,
      { id }: ListingArgs,
      { db, req }: { db: Database; req: Request }
    ): Promise<Listing> {
      try {
        const listing = await db.listings.findOne({ _id: new ObjectId(id) });

        if (!listing) throw new Error("listing can't be found");

        const viewer = await authorize(db, req);

        if (viewer?._id === listing.host) listing.authorized = true;

        return listing;
      } catch (error) {
        throw new Error(`Failed to query listing: ${error}`);
      }
    },
  },
  Listing: {
    id(listing: Listing): string {
      return listing._id.toString();
    },
    async host(
      listing: Listing,
      _args: undefined,
      { db }: { db: Database }
    ): Promise<User> {
      const host = await db.users.findOne({ _id: listing.host });

      if (!host) throw new Error("host can't be found");

      return host;
    },
    bookingsIndex(listing: Listing): string {
      return JSON.stringify(listing.bookingsIndex);
    },
    async bookings(
      listing: Listing,
      { limit, page }: ListingBookingsArgs,
      { db }: { db: Database }
    ): Promise<ListingBookingsData | null> {
      try {
        if (!listing.authorized) return null;

        const cursor = await db.bookings
          .find({ _id: { $in: listing.bookings } })
          .skip(page > 0 ? (page - 1) * limit : 0)
          .limit(limit);

        return {
          total: await cursor.count(),
          result: await cursor.toArray(),
        };
      } catch (error) {
        throw new Error(`Failed to query listing bookings: ${error}`);
      }
    },
  },
};
