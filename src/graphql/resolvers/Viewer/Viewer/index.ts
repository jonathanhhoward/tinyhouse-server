import { Viewer } from "../../../../lib/types";

export function id(viewer: Viewer): string | undefined {
  return viewer._id;
}

export function hasWallet(viewer: Viewer): boolean | undefined {
  return !!viewer.walletId;
}
