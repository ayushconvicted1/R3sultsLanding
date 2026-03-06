import { NextRequest, NextResponse } from "next/server";
import { getUserApiBaseUrl } from "@/lib/user-api";

function getBearerToken(request: NextRequest): string | null {
  const auth = request.headers.get("authorization");
  if (auth?.startsWith("Bearer ")) return auth.slice(7);
  return null;
}

/**
 * Proxy to backend: GET /api/shop/orders/my/:id (authenticated — single order by orderId or cuid).
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = getBearerToken(request);
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "Order ID required" }, { status: 400 });
    }
    const base = getUserApiBaseUrl();
    const res = await fetch(`${base}/api/shop/orders/my/${encodeURIComponent(id)}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("Shop order my/:id proxy error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}
