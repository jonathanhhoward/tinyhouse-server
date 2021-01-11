import { Request } from "express";
import { ObjectId } from "mongodb";
import { Google } from "../../../../lib/api";
import { Database, Listing } from "../../../../lib/types";
import { authorize } from "../../../../lib/utils";
import { HostListingArgs } from "../types";
import { verifyHostListingInput } from "./utils";

export async function hostListing(
  _root: undefined,
  { input }: HostListingArgs,
  { db, req }: { db: Database; req: Request }
): Promise<Listing> {
  verifyHostListingInput(input);

  const viewer = await authorize(db, req);
  if (!viewer) throw new Error("viewer cannot be found");

  const { country, admin, city } = await Google.geocode(input.address);
  if (!country || !admin || !city) throw new Error("invalid address input");

  const insertResult = await db.listings.insertOne({
    _id: new ObjectId(),
    ...input,
    bookings: [],
    bookingsIndex: {},
    country,
    admin,
    city,
    host: viewer._id,
  });

  const insertedListing: Listing = insertResult.ops[0];

  await db.users.updateOne(
    { _id: viewer._id },
    { $push: { listings: insertedListing._id } }
  );

  return insertedListing;
}
