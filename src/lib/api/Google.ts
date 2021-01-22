import { google, people_v1 } from "googleapis";
import { AddressComponent, createClient } from "@google/maps";

export type Person = people_v1.Schema$Person;

export interface GeocodeResult {
  country: string | null;
  admin: string | null;
  city: string | null;
}

const auth = new google.auth.OAuth2(
  process.env.G_CLIENT_ID,
  process.env.G_CLIENT_SECRET,
  `${process.env.PUBLIC_URL}/login`
);

const maps = createClient({ key: `${process.env.G_GEOCODE_KEY}`, Promise });

function parseAddress(
  addressComponents: AddressComponent<string>[]
): GeocodeResult {
  let country: string | null = null;
  let admin: string | null = null;
  let city: string | null = null;

  for (const component of addressComponents) {
    if (component.types.includes("country")) country = component.long_name;

    if (component.types.includes("administrative_area_level_1"))
      admin = component.long_name;

    if (
      component.types.includes("locality") ||
      component.types.includes("postal_town")
    )
      city = component.long_name;
  }

  return { country, admin, city };
}

export class Google {
  static authUrl = auth.generateAuthUrl({
    access_type: "online",
    scope: [
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
    ],
  });

  static async logIn(code: string): Promise<{ user: Person }> {
    const { tokens } = await auth.getToken(code);

    auth.setCredentials(tokens);

    const { data } = await google.people({ version: "v1", auth }).people.get({
      resourceName: "people/me",
      personFields: "emailAddresses,names,photos",
    });

    return { user: data };
  }

  static async geocode(address: string): Promise<GeocodeResult> {
    const res = await maps.geocode({ address }).asPromise();

    if (res.status < 200 || 299 < res.status)
      throw new Error("failed to geocode address");

    return parseAddress(res.json.results[0].address_components);
  }
}
