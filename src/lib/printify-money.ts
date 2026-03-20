/**
 * Printify API returns variant prices in cents (integer).
 * Display as USD dollars everywhere in the UI.
 */

export function printifyCentsToDollars(cents: number | undefined | null): number | null {
  if (cents == null || typeof cents !== "number" || Number.isNaN(cents)) return null;
  return cents / 100;
}

export function formatPrintifyUsd(cents: number | undefined | null): string {
  const d = printifyCentsToDollars(cents);
  if (d == null) return "";
  return `$${d.toFixed(2)}`;
}

/** Min/max variant price in cents */
export function variantPriceRangeCents(
  variants: Array<{ price?: number; cost?: number }> | undefined
): { min: number | null; max: number | null } {
  if (!variants?.length) return { min: null, max: null };
  const amounts: number[] = [];
  for (const v of variants) {
    const p = v.price ?? v.cost;
    if (typeof p === "number") amounts.push(p);
  }
  if (!amounts.length) return { min: null, max: null };
  return { min: Math.min(...amounts), max: Math.max(...amounts) };
}

export function formatPrintifyPriceRange(centsMin: number | null, centsMax: number | null): string {
  if (centsMin == null) return "";
  if (centsMax == null || centsMin === centsMax) return formatPrintifyUsd(centsMin);
  return `${formatPrintifyUsd(centsMin)} – ${formatPrintifyUsd(centsMax)}`;
}
