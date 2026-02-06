/**
 * Stripe metadata values are limited to 500 characters.
 * Chunk long values into key_0, key_1, ... and reassemble in webhook.
 */
const MAX_META_VALUE = 500;

/** Build metadata object with long values split into chunks (key_0, key_1, ...). */
export function buildChunkedMetadata(
  entries: Record<string, string>
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(entries)) {
    if (value.length <= MAX_META_VALUE) {
      out[key] = value;
    } else {
      for (let i = 0; i * MAX_META_VALUE < value.length; i++) {
        const chunk = value.slice(i * MAX_META_VALUE, (i + 1) * MAX_META_VALUE);
        out[`${key}_${i}`] = chunk;
      }
    }
  }
  return out;
}

/** Get a single metadata value, reassembling from key_0, key_1, ... if chunked. */
export function getChunkedMetadataValue(
  metadata: Record<string, string> | undefined,
  key: string
): string | undefined {
  if (!metadata) return undefined;
  const direct = metadata[key];
  if (direct != null && direct !== "") return direct;
  let assembled = "";
  let i = 0;
  while (metadata[`${key}_${i}`] != null) {
    assembled += metadata[`${key}_${i}`];
    i++;
  }
  return assembled === "" ? undefined : assembled;
}
