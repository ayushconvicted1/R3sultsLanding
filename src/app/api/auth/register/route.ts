import { NextRequest, NextResponse } from "next/server";
import { userApiFetch } from "@/lib/user-api";

/**
 * Proxy to external User API: POST /api/auth/register (phone + password).
 * Body: { phoneNumber, password, fullName, email?, username? }
 * Response 201: { success, message, data: { userId, phoneNumber } }
 * After registration user must verify phone via Verify OTP to receive tokens.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phoneNumber, password, fullName, email, username } = body;

    if (!phoneNumber || typeof phoneNumber !== "string") {
      return NextResponse.json(
        { success: false, error: "phoneNumber is required" },
        { status: 400 }
      );
    }
    if (!password || typeof password !== "string") {
      return NextResponse.json(
        { success: false, error: "password is required" },
        { status: 400 }
      );
    }
    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }
    if (!fullName || typeof fullName !== "string" || !fullName.trim()) {
      return NextResponse.json(
        { success: false, error: "fullName is required" },
        { status: 400 }
      );
    }

    const payload: Record<string, string> = {
      phoneNumber: phoneNumber.trim(),
      password: password.trim(),
      fullName: fullName.trim(),
    };
    if (email != null && String(email).trim()) payload.email = String(email).trim();
    if (username != null && String(username).trim()) payload.username = String(username).trim();

    const result = await userApiFetch<{
      success?: boolean;
      message?: string;
      data?: { userId?: string; phoneNumber?: string };
      error?: string;
    }>("/api/auth/register", {
      method: "POST",
      body: payload,
    });

    if (!result.success) {
      const message = result.error || (result.data as { message?: string })?.message || "Registration failed";
      return NextResponse.json(
        { success: false, error: message },
        { status: result.status >= 400 ? result.status : 500 }
      );
    }

    const data = result.data as { data?: { userId?: string; phoneNumber?: string }; message?: string };
    return NextResponse.json({
      success: true,
      message: data.message ?? "Registration successful. OTP sent for verification.",
      data: data.data ?? { phoneNumber: payload.phoneNumber },
    });
  } catch (err) {
    console.error("Register proxy error:", err);
    return NextResponse.json(
      { success: false, error: "Registration failed" },
      { status: 500 }
    );
  }
}
