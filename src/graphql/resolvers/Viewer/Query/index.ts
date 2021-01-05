import { Google } from "../../../../lib/api";

export function authUrl(): string {
  try {
    return Google.authUrl;
  } catch (error) {
    throw new Error(`Failed to query Google Auth Url: ${error}`);
  }
}
