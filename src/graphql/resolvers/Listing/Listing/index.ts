import { Database, Listing, User } from "../../../../lib/types";
import { ListingBookingsArgs, ListingBookingsData } from "../types";

export function id(listing: Listing): string {
  return listing._id.toString();
}

export async function host(
  listing: Listing,
  _args: undefined,
  { db }: { db: Database }
): Promise<User> {
  const host = await db.users.findOne({ _id: listing.host });

  if (!host) throw new Error("host can't be found");

  return host;
}

export function bookingsIndex(listing: Listing): string {
  return JSON.stringify(listing.bookingsIndex);
}

export async function bookings(
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
}
