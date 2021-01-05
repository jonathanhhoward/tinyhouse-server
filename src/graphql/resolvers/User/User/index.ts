import { Database, User } from "../../../../lib/types";
import {
  UserBookingsArgs,
  UserBookingsData,
  UserListingsArgs,
  UserListingsData,
} from "../types";

export function id(user: User): string {
  return user._id;
}

export function hasWallet(user: User): boolean {
  return Boolean(user.walletId);
}

export function income(user: User): number | null {
  return user.authorized ? user.income : null;
}

export async function bookings(
  user: User,
  { limit, page }: UserBookingsArgs,
  { db }: { db: Database }
): Promise<UserBookingsData | null> {
  try {
    if (!user.authorized) return null;

    const cursor = await db.bookings
      .find({ _id: { $in: user.bookings } })
      .skip(page > 0 ? (page - 1) * limit : 0)
      .limit(limit);

    return {
      total: await cursor.count(),
      result: await cursor.toArray(),
    };
  } catch (error) {
    throw new Error(`Failed to query user bookings: ${error}`);
  }
}

export async function listings(
  user: User,
  { limit, page }: UserListingsArgs,
  { db }: { db: Database }
): Promise<UserListingsData | null> {
  try {
    const cursor = await db.listings
      .find({ _id: { $in: user.listings } })
      .skip(page > 0 ? (page - 1) * limit : 0)
      .limit(limit);

    return {
      total: await cursor.count(),
      result: await cursor.toArray(),
    };
  } catch (error) {
    throw new Error(`Failed to query user listings: ${error}`);
  }
}
