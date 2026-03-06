import { NextRequest, NextResponse } from "next/server";
import { userApiFetch } from "@/lib/user-api";

function getBearerToken(request: NextRequest): string | null {
  const auth = request.headers.get("authorization");
  if (auth?.startsWith("Bearer ")) return auth.slice(7);
  return null;
}

/**
 * Proxy to external User API: POST /api/auth/logout (invalidates refresh token server-side).
 * Headers: Authorization: Bearer <accessToken>
 */
export async function POST(request: NextRequest) {
  const token = getBearerToken(request);
  if (!token) {
    return NextResponse.json({ success: true, message: "Logged out" });
  }
  try {
    await userApiFetch("/api/auth/logout", { method: "POST", token });
  } catch {
    // Best-effort: still consider client logged out
  }
  return NextResponse.json({ success: true, message: "Logged out" });
}
