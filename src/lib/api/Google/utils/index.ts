import { AddressComponent } from "@google/maps";

export interface GeocodeResult {
  country: string | null;
  admin: string | null;
  city: string | null;
}

export function parseAddress(
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
