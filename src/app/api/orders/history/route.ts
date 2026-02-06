import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { getOrdersByEmail } from "@/lib/orders";

function getBearerToken(request: NextRequest): string | null {
  const auth = request.headers.get("authorization");
  if (auth?.startsWith("Bearer ")) return auth.slice(7);
  return null;
}

export async function GET(request: NextRequest) {
  const token = getBearerToken(request);
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const payload = await verifyToken(token);
  if (!payload) {
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
  }

  try {
    const orders = await getOrdersByEmail(payload.email);
    return NextResponse.json({ orders });
  } catch (err) {
    console.error("Order history error:", err);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
