import { Request, Response } from "express";
import { Google } from "../../../../lib/api";
import { Database, User } from "../../../../lib/types";

export const cookieOptions = {
  httpOnly: true,
  sameSite: true,
  signed: true,
  secure: process.env.NODE_ENV !== "development",
};

export async function logInViaGoogle(
  code: string,
  token: string,
  db: Database,
  res: Response
): Promise<User | undefined> {
  const { user } = await Google.logIn(code);

  if (!user) throw new Error("Google login error");

  const _id = user.names?.[0].metadata?.source?.id;
  const name = user.names?.[0].displayName;
  const avatar = user.photos?.[0].url;
  const contact = user.emailAddresses?.[0].value;

  if (!_id || !name || !avatar || !contact)
    throw new Error("Invalid Google user");

  const updateResult = await db.users.findOneAndUpdate(
    { _id },
    {
      $set: {
        name,
        avatar,
        contact,
        token,
      },
    },
    { returnOriginal: false }
  );

  let viewer = updateResult.value;

  if (!viewer) {
    const insertResult = await db.users.insertOne({
      _id,
      name,
      avatar,
      contact,
      token,
      income: 0,
      bookings: [],
      listings: [],
    });

    viewer = insertResult.ops[0];
  }

  res.cookie("viewer", _id, {
    ...cookieOptions,
    maxAge: 365 * 24 * 60 * 60 * 1000,
  });

  return viewer;
}

export async function logInViaCookie(
  token: string,
  db: Database,
  req: Request,
  res: Response
): Promise<User | undefined> {
  const updateResult = await db.users.findOneAndUpdate(
    { _id: req.signedCookies.viewer },
    { $set: { token } },
    { returnOriginal: false }
  );

  const viewer = updateResult.value;

  if (!viewer) res.clearCookie("viewer", cookieOptions);

  return viewer;
}
