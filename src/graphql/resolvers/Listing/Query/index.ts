import { Request } from "express";
import { ObjectId } from "mongodb";
import { Google } from "../../../../lib/api";
import { authorize } from "../../../../lib/utils";
import { Database, Listing } from "../../../../lib/types";
import {
  ListingArgs,
  ListingsArgs,
  ListingsData,
  ListingsFilter,
  ListingsQuery,
} from "../types";
import { parseQuery, parseRegion } from "./utils";

export async function listing(
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
}

export async function listings(
  _root: undefined,
  { location, filter, limit, page }: ListingsArgs,
  { db }: { db: Database }
): Promise<ListingsData> {
  try {
    let query: ListingsQuery = {};
    let region: string | null = null;

    if (location) {
      const geocode = await Google.geocode(location);
      query = parseQuery(geocode);
      region = parseRegion(query);
    }

    let cursor = await db.listings.find(query);

    if (filter) {
      cursor =
        filter === ListingsFilter.PRICE_LOW_TO_HIGH
          ? cursor.sort({ price: 1 })
          : cursor.sort({ price: -1 });
    }

    cursor = cursor.skip(page > 0 ? (page - 1) * limit : 0).limit(limit);

    return {
      region,
      total: await cursor.count(),
      result: await cursor.toArray(),
    };
  } catch (error) {
    throw new Error(`Failed to query listings: ${error}`);
  }
}
