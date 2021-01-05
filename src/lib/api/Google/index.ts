import { google, people_v1 } from "googleapis";
import { createClient } from "@google/maps";
import { GeocodeResult, parseAddress } from "./utils";

export type Person = people_v1.Schema$Person;

const auth = new google.auth.OAuth2(
  process.env.G_CLIENT_ID,
  process.env.G_CLIENT_SECRET,
  `${process.env.PUBLIC_URL}/login`
);

const maps = createClient({ key: `${process.env.G_GEOCODE_KEY}`, Promise });

const authUrl = auth.generateAuthUrl({
  access_type: "online",
  scope: [
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
  ],
});

async function logIn(code: string): Promise<{ user: Person }> {
  const { tokens } = await auth.getToken(code);

  auth.setCredentials(tokens);

  const { data } = await google.people({ version: "v1", auth }).people.get({
    resourceName: "people/me",
    personFields: "emailAddresses,names,photos",
  });

  return { user: data };
}

async function geocode(address: string): Promise<GeocodeResult> {
  const res = await maps.geocode({ address }).asPromise();

  if (res.status < 200 || 299 < res.status)
    throw new Error("failed to geocode address");

  return parseAddress(res.json.results[0].address_components);
}

export const Google = {
  authUrl,
  logIn,
  geocode,
};
