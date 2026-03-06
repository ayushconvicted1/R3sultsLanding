import { NextRequest, NextResponse } from "next/server";
import { userApiFetch } from "@/lib/user-api";

/**
 * Proxy to external User API: POST /api/auth/forgot-password
 * Body: { phoneNumber: string }
 * Always returns success (doesn't reveal if account exists).
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phoneNumber } = body;
    if (!phoneNumber || typeof phoneNumber !== "string") {
      return NextResponse.json(
        { error: "phoneNumber is required" },
        { status: 400 }
      );
    }

    await userApiFetch("/api/auth/forgot-password", {
      method: "POST",
      body: { phoneNumber: phoneNumber.trim() },
    });

    return NextResponse.json({
      success: true,
      message: "If an account exists, you will receive instructions to reset your password.",
    });
  } catch (err) {
    console.error("Forgot password proxy error:", err);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
