import { NextRequest, NextResponse } from "next/server";

/** Always run on the server; read AUTH_TOKEN at request time */
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Proxies request to external products API.
 * Uses DOMAIN_NAME and AUTH_TOKEN from .env.local. Per PRODUCTS_API_EXTERNAL.md
 * the external API expects: Authorization: Bearer <token>
 * Forwards query params: page, limit, search, category, status, brand, featured
 */
export async function GET(request: NextRequest) {
  try {
    const domain = (process.env.DOMAIN_NAME ?? "").replace(/\/$/, "").trim();
    let token = (process.env.AUTH_TOKEN ?? "").trim();
    if (token.length >= 2 && (token.startsWith('"') && token.endsWith('"') || token.startsWith("'") && token.endsWith("'"))) {
      token = token.slice(1, -1).trim();
    }

    if (!domain || !token) {
      return NextResponse.json(
        {
          error: "Server configuration error: DOMAIN_NAME or AUTH_TOKEN missing in env",
          hasDomain: !!domain,
          hasToken: !!token,
        },
        { status: 500 }
      );
    }

    const { searchParams } = request.nextUrl;
    const params = new URLSearchParams();
    ["page", "limit", "search", "category", "status", "brand", "featured"].forEach((key) => {
      const v = searchParams.get(key);
      if (v != null && v !== "") params.set(key, v);
    });
    if (!params.has("limit")) params.set("limit", "100");
    const qs = params.toString();
    const url = `${domain}/api/products${qs ? `?${qs}` : ""}`;
    const headers: Record<string, string> = {
      Authorization: `Bearer ${token}`,
    };

    const res = await fetch(url, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    if (!res.ok) {
      const text = await res.text();
      const is401 = res.status === 401;
      return NextResponse.json(
        {
          error: is401
            ? "External API rejected request (401). Check that AUTH_TOKEN in .env.local is set, has no extra spaces/quotes, and is a valid token. The external API expects: Authorization: Bearer <token>"
            : "Products API error",
          status: res.status,
          body: text,
        },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Products proxy error:", err);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
