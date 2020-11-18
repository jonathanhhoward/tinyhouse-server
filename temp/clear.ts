// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config();

import { connectDatabase } from "../src/database";

async function clear() {
  try {
    console.log("[clear] : running...");

    const db = await connectDatabase();

    const bookings = await db.bookings.find({}).toArray();
    const listings = await db.listings.find({}).toArray();
    const users = await db.users.find({}).toArray();

    if (bookings.length) await db.bookings.drop();
    if (listings.length) await db.listings.drop();
    if (users.length) await db.users.drop();

    console.log("[clear] : success");
  } catch {
    throw new Error("failed to clear database");
  }
}

clear().catch(console.error);
