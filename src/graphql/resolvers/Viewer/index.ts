import { IResolvers } from "apollo-server-express";
import { Request, Response } from "express";
import { Google } from "../../../lib/api";
import { Viewer, Database, User } from "../../../lib/types";
import { logInViaGoogle, logInViaCookie, cookieOptions } from "./utils";
import { LogInArgs } from "./types";
import crypto from "crypto";

export const viewerResolvers: IResolvers = {
  Query: {
    authUrl(): string {
      try {
        return Google.authUrl;
      } catch (error) {
        throw new Error(`Failed to query Google Auth Url: ${error}`);
      }
    },
  },
  Mutation: {
    async logIn(
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
    },
    logOut(
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
    },
    connectStripe(): Viewer {
      return { didRequest: true };
    },
    disconnectStripe(): Viewer {
      return { didRequest: true };
    },
  },
  Viewer: {
    id(viewer: Viewer): string | undefined {
      return viewer._id;
    },
    hasWallet(viewer: Viewer): boolean | undefined {
      return !!viewer.walletId;
    },
  },
};
