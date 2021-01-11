import { ListingType } from "../../../../../lib/types";
import { HostListingInput } from "../../types";

export function verifyHostListingInput({
  title,
  description,
  type,
  price,
}: HostListingInput): void {
  if (title.length > 100)
    throw new Error("listing title must be under 100 characters");

  if (description.length > 5000)
    throw new Error("listing description must be under 5000 characters");

  if (type !== ListingType.Apartment && type !== ListingType.House)
    throw new Error("listing type must be either an apartment or a house");

  if (price < 0) throw new Error("price must be greater than 0");
}
