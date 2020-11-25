import { Request } from "express";
import { Database, User } from "../types";

export async function authorize(
  db: Database,
  req: Request
): Promise<User | null> {
  const token = req.get("X-CSRF_TOKEN");

  return await db.users.findOne({
    _id: req.signedCookies.viewer,
    token,
  });
}
