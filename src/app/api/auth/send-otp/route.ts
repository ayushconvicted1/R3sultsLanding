import { NextRequest, NextResponse } from "next/server";
import { userApiFetch } from "@/lib/user-api";

/**
 * Proxy to external User API: POST /api/auth/phone/send-otp
 * Body: { phoneNumber: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phoneNumber } = body;
    if (!phoneNumber || typeof phoneNumber !== "string") {
      return NextResponse.json(
        { success: false, error: "phoneNumber is required" },
        { status: 400 }
      );
    }
    const result = await userApiFetch<{ success?: boolean; data?: { phoneNumber?: string; expiresIn?: number }; error?: string }>(
      "/api/auth/phone/send-otp",
      { method: "POST", body: { phoneNumber } }
    );
    if (!result.success && result.status === 401) {
      return NextResponse.json(
        { success: false, error: result.error || "Failed to send OTP" },
        { status: 401 }
      );
    }
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || "Failed to send OTP" },
        { status: result.status >= 400 ? result.status : 500 }
      );
    }
    return NextResponse.json({
      success: true,
      data: result.data?.data ?? { phoneNumber, expiresIn: result.data?.data?.expiresIn },
    });
  } catch (err) {
    console.error("Send OTP proxy error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to send OTP" },
      { status: 500 }
    );
  }
}
