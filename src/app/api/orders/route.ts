import { NextRequest, NextResponse } from "next/server";
import { getOrders } from "@/lib/orders";

function isAuthorized(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  const queryKey = request.nextUrl.searchParams.get("key");
  const secret = process.env.AUTH_TOKEN || process.env.ADMIN_ORDERS_SECRET;
  if (!secret) return false;
  return token === secret || queryKey === secret;
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const orders = await getOrders();
    return NextResponse.json({ orders });
  } catch (err) {
    console.error("Failed to fetch orders:", err);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
