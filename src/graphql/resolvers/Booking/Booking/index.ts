import { Booking, Database, Listing } from "../../../../lib/types";

export function id(booking: Booking): string {
  return booking._id.toString();
}

export function listing(
  booking: Booking,
  _args: undefined,
  { db }: { db: Database }
): Promise<Listing | null> {
  return db.listings.findOne({ _id: booking.listing });
}
