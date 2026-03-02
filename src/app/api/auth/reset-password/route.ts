import { NextRequest, NextResponse } from "next/server";
import { userApiFetch } from "@/lib/user-api";

/**
 * Proxy to external User API: POST /api/auth/reset-password
 * Body: { phoneNumber: string, otp: string, newPassword: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phoneNumber, otp, newPassword } = body;

    if (!phoneNumber || typeof phoneNumber !== "string") {
      return NextResponse.json(
        { error: "phoneNumber is required" },
        { status: 400 }
      );
    }
    if (!otp || typeof otp !== "string") {
      return NextResponse.json(
        { error: "otp is required" },
        { status: 400 }
      );
    }
    if (!newPassword || typeof newPassword !== "string") {
      return NextResponse.json(
        { error: "newPassword is required" },
        { status: 400 }
      );
    }
    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const result = await userApiFetch<{ success?: boolean; message?: string; error?: string }>(
      "/api/auth/reset-password",
      {
        method: "POST",
        body: { phoneNumber: phoneNumber.trim(), otp: otp.trim(), newPassword: newPassword.trim() },
      }
    );

    if (!result.success) {
      const message = result.error || (result.data as { message?: string })?.message || "Password reset failed";
      return NextResponse.json(
        { error: message },
        { status: result.status >= 400 ? result.status : 500 }
      );
    }

    const data = result.data as { message?: string };
    return NextResponse.json({
      success: true,
      message: data.message ?? "Password reset successful. Please login again.",
    });
  } catch (err) {
    console.error("Reset password proxy error:", err);
    return NextResponse.json(
      { error: "Failed to reset password" },
      { status: 500 }
    );
  }
}
