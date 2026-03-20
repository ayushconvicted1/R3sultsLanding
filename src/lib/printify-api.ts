/**
 * Server-side only. Printify API does not support CORS – all calls from Next.js API routes.
 */

const PRINTIFY_BASE = "https://api.printify.com/v1";

function getToken(): string {
  const token = process.env.PRINTIFY_API_TOKEN;
  if (!token) throw new Error("PRINTIFY_API_TOKEN is not set");
  return token;
}

export function getPrintifyShopId(): string {
  const id = process.env.PRINTIFY_SHOP_ID;
  if (!id) throw new Error("PRINTIFY_SHOP_ID is not set");
  return id;
}

type PrintifyFetchOptions = {
  method?: "GET" | "POST" | "PUT";
  body?: unknown;
};

export async function printifyFetch<T>(
  path: string,
  options: PrintifyFetchOptions = {}
): Promise<{ data?: T; status: number; error?: string }> {
  const token = getToken();
  const url = path.startsWith("http") ? path : `${PRINTIFY_BASE}${path.startsWith("/") ? path : `/${path}`}`;
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    "User-Agent": "R3sultsLanding/1.0",
    "Content-Type": "application/json; charset=utf-8",
  };
  const res = await fetch(url, {
    method: options.method ?? "GET",
    headers,
    ...(options.body != null && { body: JSON.stringify(options.body) }),
  });
  let data: T | undefined;
  try {
    const text = await res.text();
    if (text) data = JSON.parse(text) as T;
  } catch {
    return { status: res.status, error: "Invalid JSON response" };
  }
  if (!res.ok) {
    const errMsg = (data as { message?: string })?.message ?? (data as { error?: string })?.error ?? res.statusText;
    return { data, status: res.status, error: errMsg };
  }
  return { data, status: res.status };
}

/** GET /v1/shops.json */
export async function getShops(): Promise<{ id: number; title: string; sales_channel: string }[]> {
  const result = await printifyFetch<unknown[]>("/shops.json");
  if (!result.data || !Array.isArray(result.data)) return [];
  return result.data as { id: number; title: string; sales_channel: string }[];
}

/** GET /v1/shops/{shop_id}/products.json - returns { data: products[], current_page, total? } */
export async function getShopProducts(
  shopId: string,
  page = 1,
  limit = 24
): Promise<{ products: unknown[]; total?: number; page?: number; limit?: number }> {
  const q = new URLSearchParams({ page: String(page), limit: String(Math.min(limit, 50)) });
  const result = await printifyFetch<{ data?: unknown[]; current_page?: number; total?: number }>(
    `/shops/${shopId}/products.json?${q}`
  );
  if (!result.data) return { products: [], total: 0, page, limit };
  const d = result.data as { data?: unknown[]; current_page?: number; total?: number };
  const products = Array.isArray(d.data) ? d.data : [];
  const total = typeof d.total === "number" ? d.total : products.length;
  return { products, total, page: d.current_page ?? page, limit };
}

/** GET /v1/shops/{shop_id}/products/{product_id}.json */
export async function getShopProduct(
  shopId: string,
  productId: string
): Promise<{ product?: unknown }> {
  const result = await printifyFetch<unknown>(`/shops/${shopId}/products/${productId}.json`);
  if (!result.data) return {};
  return { product: result.data };
}

/** POST /v1/shops/{shop_id}/orders.json */
export async function createOrder(
  shopId: string,
  body: {
    external_id?: string;
    label?: string;
    line_items: Array<{ product_id: string; variant_id: number; quantity: number }>;
    shipping_method: number;
    address_to: Record<string, string>;
    send_shipping_notification?: boolean;
  }
): Promise<{ id?: string; error?: string }> {
  const result = await printifyFetch<{ id?: string }>(`/shops/${shopId}/orders.json`, {
    method: "POST",
    body,
  });
  if (result.error) return { error: result.error };
  return { id: result.data?.id };
}
