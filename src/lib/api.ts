/** Base URL for products API (DOMAIN_NAME from env). Request URL will be DOMAIN_NAME/api/products */
export function getProductsApiBase(): string {
  const base = process.env.NEXT_PUBLIC_DOMAIN_NAME ?? "";
  return base.replace(/\/$/, "").trim();
}
