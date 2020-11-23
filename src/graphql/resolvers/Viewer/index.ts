import { IResolvers } from "apollo-server-express";
import { Google } from "../../../lib/api";
import { Viewer, Database } from "../../../lib/types";
import { getGoogleUser, updateUser, createUser } from "./utils";
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
      { db }: { db: Database }
    ): Promise<Viewer> {
      try {
        const code = input?.code;

        if (!code) return { didRequest: true };

        const googleUser = await getGoogleUser(code);
        const token = crypto.randomBytes(16).toString("hex");
        let user = await updateUser(googleUser, token, db);
        if (!user) user = await createUser(googleUser, token, db);

        return user
          ? {
              _id: user._id,
              token: user.token,
              avatar: user.avatar,
              walletId: user.walletId,
              didRequest: true,
            }
          : { didRequest: true };
      } catch (error) {
        throw new Error(`Failed to log in: ${error}`);
      }
    },
    logOut(): Viewer {
      try {
        return { didRequest: true };
      } catch (error) {
        throw new Error(`Failed to log out: ${error}`);
      }
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
