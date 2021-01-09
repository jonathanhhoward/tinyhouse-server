import { Request } from "express";
import { Database, User } from "../types";

export async function authorize(
  db: Database,
  req: Request
): Promise<User | null> {
  return await db.users.findOne({
    _id: req.signedCookies.viewer,
    token: req.get("X-CSRF-TOKEN"),
  });
}
