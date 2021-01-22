import { BookingsIndex } from "../../../../../lib/types";

export const MILLISEC_PER_DAY = 86400000;

export function resolveBookingsIndex(
  bookingsIndex: BookingsIndex,
  checkInDate: string,
  checkOutDate: string
): BookingsIndex {
  let dateCursor = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);
  const newBookingsIndex: BookingsIndex = { ...bookingsIndex };

  while (dateCursor <= checkOut) {
    const y = dateCursor.getUTCFullYear();
    const m = dateCursor.getUTCMonth();
    const d = dateCursor.getUTCDate();

    if (!newBookingsIndex[y]) newBookingsIndex[y] = {};

    if (!newBookingsIndex[y][m]) newBookingsIndex[y][m] = {};

    if (!newBookingsIndex[y][m][d]) {
      newBookingsIndex[y][m][d] = true;
    } else {
      throw new Error(
        "selected dates can't overlap dates that have already been booked"
      );
    }

    dateCursor = new Date(dateCursor.getTime() + MILLISEC_PER_DAY);
  }

  return newBookingsIndex;
}
