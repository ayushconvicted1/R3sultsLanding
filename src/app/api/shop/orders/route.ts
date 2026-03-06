import { NextRequest, NextResponse } from "next/server";
import { getUserApiBaseUrl } from "@/lib/user-api";

/**
 * Proxy to backend: POST /api/shop/orders (create order — public, no auth).
 * Body: lineItems, shippingAddress, billingAddress?, billingSameAsShipping?, shippingAmount?
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const base = getUserApiBaseUrl();
    const res = await fetch(`${base}/api/shop/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("Shop orders create proxy error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to create order" },
      { status: 500 }
    );
  }
}
