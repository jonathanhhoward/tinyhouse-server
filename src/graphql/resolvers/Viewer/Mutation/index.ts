import crypto from "crypto";
import { Request, Response } from "express";
import { ConnectStripeArgs, LogInArgs } from "../types";
import { StripeApi as Stripe } from "../../../../lib/api";
import { Database, User, Viewer } from "../../../../lib/types";
import { authorize } from "../../../../lib/utils";
import { cookieOptions, logInViaCookie, logInViaGoogle } from "./utils";

export async function logIn(
  _root: undefined,
  { input }: LogInArgs,
  { db, req, res }: { db: Database; req: Request; res: Response }
): Promise<Viewer> {
  try {
    const code = input?.code;
    const token = crypto.randomBytes(16).toString("hex");

    const viewer: User | undefined = code
      ? await logInViaGoogle(code, token, db, res)
      : await logInViaCookie(token, db, req, res);

    return viewer
      ? {
          _id: viewer._id,
          token: viewer.token,
          avatar: viewer.avatar,
          walletId: viewer.walletId,
          didRequest: true,
        }
      : { didRequest: true };
  } catch (error) {
    throw new Error(`Failed to log in: ${error}`);
  }
}

export function logOut(
  _root: undefined,
  _args: undefined,
  { res }: { res: Response }
): Viewer {
  try {
    res.clearCookie("viewer", cookieOptions);
    return { didRequest: true };
  } catch (error) {
    throw new Error(`Failed to log out: ${error}`);
  }
}

export async function connectStripe(
  _root: undefined,
  { input }: ConnectStripeArgs,
  { db, req }: { db: Database; req: Request }
): Promise<Viewer> {
  try {
    const { code } = input;

    let viewer = await authorize(db, req);
    if (!viewer) throw new Error("viewer cannot be found");

    const wallet = await Stripe.connect(code);
    if (!wallet) throw new Error("stripe grant error");

    const updateRes = await db.users.findOneAndUpdate(
      { _id: viewer._id },
      { $set: { walletId: wallet.stripe_user_id } },
      { returnOriginal: false }
    );
    if (!updateRes.value) throw new Error("viewer could not be updated");

    viewer = updateRes.value;

    return {
      _id: viewer._id,
      token: viewer.token,
      avatar: viewer.avatar,
      walletId: viewer.walletId,
      didRequest: true,
    };
  } catch (error) {
    throw new Error(`Failed to connect with Stripe: ${error}`);
  }
}

export async function disconnectStripe(
  _root: undefined,
  _args: undefined,
  { db, req }: { db: Database; req: Request }
): Promise<Viewer> {
  try {
    let viewer = await authorize(db, req);
    if (!viewer) throw new Error("viewer cannot be found");

    const updateRes = await db.users.findOneAndUpdate(
      { _id: viewer._id },
      { $set: { walletId: undefined } },
      { returnOriginal: false }
    );
    if (!updateRes.value) throw new Error("viewer could not be updated");

    viewer = updateRes.value;

    return {
      _id: viewer._id,
      token: viewer.token,
      avatar: viewer.avatar,
      walletId: viewer.walletId,
      didRequest: true,
    };
  } catch (error) {
    throw new Error(`Failed to disconnect with Stripe: ${error}`);
  }
}
