import { NextRequest, NextResponse } from "next/server";
import { userApiFetch } from "@/lib/user-api";

function getBearerToken(request: NextRequest): string | null {
  const auth = request.headers.get("authorization");
  if (auth?.startsWith("Bearer ")) return auth.slice(7);
  return null;
}

/**
 * Proxy to external User API: POST /api/auth/update-phone (authenticated).
 * Headers: Authorization: Bearer <accessToken>
 * Body: { phoneNumber: string }
 * Sends OTP to the new number; use Verify OTP to confirm.
 */
export async function POST(request: NextRequest) {
  const token = getBearerToken(request);
  if (!token) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { phoneNumber } = body;
    if (!phoneNumber || typeof phoneNumber !== "string") {
      return NextResponse.json(
        { success: false, error: "phoneNumber is required" },
        { status: 400 }
      );
    }

    const result = await userApiFetch<{ success?: boolean; message?: string; error?: string }>(
      "/api/auth/update-phone",
      { method: "POST", body: { phoneNumber: phoneNumber.trim() }, token }
    );

    if (!result.success) {
      const message = result.error || (result.data as { message?: string })?.message || "Failed to send OTP";
      return NextResponse.json(
        { success: false, error: message },
        { status: result.status >= 400 ? result.status : 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: (result.data as { message?: string })?.message ?? "OTP sent to your phone.",
    });
  } catch (err) {
    console.error("Update phone proxy error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to update phone" },
      { status: 500 }
    );
  }
}
