import { ObjectId } from "mongodb";
import { IResolvers } from "apollo-server-express";
import { Database, Listing } from "../../../lib/types";

export const listingResolvers: IResolvers = {
  Query: {
    async listings(
      _root: undefined,
      _args: Record<string, unknown>,
      { db }: { db: Database }
    ): Promise<Listing[]> {
      return await db.listings.find({}).toArray();
    },
  },
  Mutation: {
    async deleteListing(
      _root: undefined,
      { id }: { id: string },
      { db }: { db: Database }
    ): Promise<Listing> {
      const { value: deletedListing } = await db.listings.findOneAndDelete({
        _id: new ObjectId(id),
      });

      if (!deletedListing) {
        throw new Error("failed to delete listing");
      }

      return deletedListing;
    },
  },
  Listing: {
    id(listing: Listing): string {
      return listing._id.toString();
    },
  },
};
