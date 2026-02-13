import { NextRequest, NextResponse } from "next/server";
import { userApiFetch } from "@/lib/user-api";
import { getOrdersByEmail } from "@/lib/orders";

function getBearerToken(request: NextRequest): string | null {
  const auth = request.headers.get("authorization");
  if (auth?.startsWith("Bearer ")) return auth.slice(7);
  return null;
}

function getEmailFromUser(user: Record<string, unknown> | undefined): string {
  if (!user) return "";
  const email = (user.email as string) || "";
  const phone = (user.phoneNumber as string) || (user.phone as string) || "";
  if (email) return email;
  if (phone) return `${String(phone).replace(/\D/g, "")}@phone`;
  return "";
}

export async function GET(request: NextRequest) {
  const token = getBearerToken(request);
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await userApiFetch<{ success?: boolean; data?: { user?: Record<string, unknown> }; error?: string }>(
    "/api/auth/me",
    { method: "GET", token }
  );

  if (!result.success) {
    return NextResponse.json(
      { error: result.error || "Invalid or expired token" },
      { status: 401 }
    );
  }

  const rawUser = (result.data as Record<string, unknown>)?.data?.user ?? (result.data as Record<string, unknown>)?.user;
  const email = getEmailFromUser(rawUser as Record<string, unknown> | undefined);
  if (!email) {
    return NextResponse.json({ orders: [] });
  }

  try {
    const orders = await getOrdersByEmail(email);
    return NextResponse.json({ orders });
  } catch (err) {
    console.error("Order history error:", err);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
