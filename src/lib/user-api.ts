/**
 * Base URL for the external User API (OTP auth). All endpoints from API_USAGE.csv use this domain.
 */
export function getUserApiBaseUrl(): string {
  const url = process.env.USER_API_BASE_URL || "https://dms-rust-omega.vercel.app";
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
  try {
    data = await res.json();
  } catch {
    return { status: res.status, error: "Invalid response" };
  }
  const success = res.ok && (data as { success?: boolean })?.success !== false;
  return {
    data: data as T,
    success,
    error: (data as { error?: string })?.error || (success ? undefined : "Request failed"),
    status: res.status,
  };
}
