import { randomInt } from "crypto";

const ALPHANUM = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

/**
 * Generates a unique order ID in the format ORD-{6 alphanumeric characters}.
 * 36^6 = 2,176,782,336 possibilities.
 */
export function generateOrderId(): string {
  let suffix = "";
  for (let i = 0; i < 6; i++) {
    suffix += ALPHANUM[randomInt(0, ALPHANUM.length)];
  }
  return `ORD-${suffix}`;
}
