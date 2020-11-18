/* eslint-disable @typescript-eslint/ban-ts-comment */
// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config();

import { connectDatabase } from "../src/database";
// @ts-ignore
import { listings, users } from "./data";

async function seed() {
  try {
    console.log("[seed]: running...");

    const db = await connectDatabase();

    for (const listing of listings) {
      await db.listings.insertOne(listing);
    }

    for (const user of users) {
      await db.users.insertOne(user);
    }

    console.log("[seed]: success");
  } catch {
    throw new Error("failed to seed database");
  }
}

seed().catch(console.error);
