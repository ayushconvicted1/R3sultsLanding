/**
 * Base URL for the external User API (auth, shop orders). Prefer USER_API_BASE_URL so auth keeps working.
 */
export function getUserApiBaseUrl(): string {
  const url =
    process.env.USER_API_BASE_URL ||
    process.env.DOMAIN_NAME ||
    "https://dms-rust-omega.vercel.app";
  return url.replace(/\/$/, "");
}

export async function userApiFetch<T = unknown>(
  path: string,
  options: { method?: string; body?: unknown; token?: string } = {}
): Promise<{ data?: T; success?: boolean; error?: string; status: number }> {
  const base = getUserApiBaseUrl();
  const url = path.startsWith("http") ? path : `${base}${path.startsWith("/") ? path : `/${path}`}`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.token && { Authorization: `Bearer ${options.token}` }),
  };
  const res = await fetch(url, {
    method: options.method || "GET",
    headers,
    ...(options.body != null && { body: JSON.stringify(options.body) }),
  });
  let data: T | undefined;
  let rawText = "";
  try {
    rawText = await res.text();
    data = rawText ? (JSON.parse(rawText) as T) : ({} as T);
  } catch {
    return {
      status: res.status,
      error: rawText?.trim() || `Request failed (${res.status})`,
    };
  }
  const success = res.ok && (data as { success?: boolean })?.success !== false;
  const payload = data as {
    error?: string;
    message?: string;
    data?: { message?: string; error?: string };
  };
  const errorMessage =
    payload?.error ||
    payload?.message ||
    payload?.data?.error ||
    payload?.data?.message ||
    (success ? undefined : `Request failed (${res.status})`);
  return {
    data: data as T,
    success,
    error: errorMessage,
    status: res.status,
  };
}
