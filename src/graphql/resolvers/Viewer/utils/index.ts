import { Google } from "../../../../lib/api";
import { Database, User } from "../../../../lib/types";

interface GoogleUser {
  _id: string;
  name: string;
  avatar: string;
  contact: string;
}

export async function getGoogleUser(code: string): Promise<GoogleUser> {
  const { user } = await Google.logIn(code);

  if (!user) throw new Error("Google login error");

  const _id = user?.names?.[0]?.metadata?.source?.id;
  const name = user?.names?.[0]?.displayName;
  const avatar = user?.photos?.[0]?.url;
  const contact = user?.emailAddresses?.[0]?.value;

  if (!_id || !name || !avatar || !contact)
    throw new Error("Invalid Google user");

  return { _id, name, avatar, contact };
}

export async function updateUser(
  { _id, name, avatar, contact }: GoogleUser,
  token: string,
  db: Database
): Promise<User | undefined> {
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

  return updateResult.value;
}

export async function createUser(
  user: GoogleUser,
  token: string,
  db: Database
): Promise<User | undefined> {
  const insertResult = await db.users.insertOne({
    ...user,
    token,
    income: 0,
    bookings: [],
    listings: [],
  });

  return insertResult.ops[0];
}
