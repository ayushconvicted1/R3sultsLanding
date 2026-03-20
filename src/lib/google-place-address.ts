/** Map Google Places address_components → Printify-style fields */

export type ParsedPlaceAddress = {
  address1: string;
  address2?: string;
  city: string;
  region: string;
  zip: string;
  country: string;
};

type Comp = { long_name: string; short_name: string; types: string[] };

export function parseGoogleAddressComponents(components: Comp[]): ParsedPlaceAddress {
  let streetNumber = "";
  let route = "";
  let subpremise = "";
  let city = "";
  let region = "";
  let zip = "";
  let country = "US";

  for (const c of components) {
    const types = c.types;
    if (types.includes("street_number")) streetNumber = c.long_name;
    if (types.includes("route")) route = c.long_name;
    if (types.includes("subpremise")) subpremise = c.long_name;
    if (types.includes("locality")) city = c.long_name;
    if (types.includes("postal_town") && !city) city = c.long_name;
    if (types.includes("sublocality") && !city) city = c.long_name;
    if (types.includes("administrative_area_level_1")) region = c.short_name;
    if (types.includes("postal_code")) zip = c.long_name;
    if (types.includes("country")) country = c.short_name;
  }

  const line1 = [streetNumber, route].filter(Boolean).join(" ").trim();
  const address1 = line1 || route || "";

  return {
    address1,
    address2: subpremise || undefined,
    city,
    region,
    zip,
    country: country.length === 2 ? country.toUpperCase() : "US",
  };
}
