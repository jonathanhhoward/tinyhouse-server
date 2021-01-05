import { GeocodeResult } from "../../../../../lib/api/Google/utils";
import { ListingsQuery } from "../../types";

export function parseQuery({
  country,
  admin,
  city,
}: GeocodeResult): ListingsQuery {
  if (!country) throw new Error("no country found");

  const query: ListingsQuery = {};
  if (city) query.city = city;
  if (admin) query.admin = admin;
  query.country = country;

  return query;
}

export function parseRegion({ country, admin, city }: ListingsQuery): string {
  const cityText = city ? city + ", " : "";
  const adminText = admin ? admin + ", " : "";

  return cityText + adminText + country;
}
