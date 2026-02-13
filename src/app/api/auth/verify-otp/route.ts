import { NextRequest, NextResponse } from "next/server";
import { userApiFetch } from "@/lib/user-api";
import { normalizeUser } from "@/lib/normalize-user";
import type { AppUser } from "@/types/user";

/**
 * Proxy to external User API: POST /api/auth/phone/verify-otp
 * Body: { phoneNumber: string, otp: string }
 * Returns: { user, accessToken, refreshToken, isNewUser }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phoneNumber, otp } = body;
    if (!phoneNumber || typeof phoneNumber !== "string") {
      return NextResponse.json(
        { success: false, error: "phoneNumber is required" },
        { status: 400 }
      );
    }
    if (!otp || typeof otp !== "string") {
      return NextResponse.json(
        { success: false, error: "otp is required" },
        { status: 400 }
      );
    }
    const result = await userApiFetch<{
      success?: boolean;
      data?: { user?: Record<string, unknown>; accessToken?: string; refreshToken?: string; isNewUser?: boolean };
      accessToken?: string;
      refreshToken?: string;
      error?: string;
    }>("/api/auth/phone/verify-otp", {
      method: "POST",
      body: { phoneNumber, otp },
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || "Invalid OTP or verification failed" },
        { status: result.status === 401 ? 401 : result.status >= 400 ? result.status : 500 }
      );
    }

    const data = result.data as Record<string, unknown> | undefined;
    const rawUser = (data?.data as Record<string, unknown>)?.user ?? data?.user;
    const accessToken = (data?.data as Record<string, unknown>)?.accessToken ?? data?.accessToken;
    const refreshToken = (data?.data as Record<string, unknown>)?.refreshToken ?? data?.refreshToken;
    const isNewUser = (data?.data as Record<string, unknown>)?.isNewUser ?? data?.isNewUser;

    if (!accessToken) {
      return NextResponse.json(
        { success: false, error: "No access token returned" },
        { status: 500 }
      );
    }

    const user: AppUser = normalizeUser(rawUser as Record<string, unknown> | undefined);
    if (!user.email && phoneNumber) user.email = `${phoneNumber.replace(/\D/g, "")}@phone`;
    if (!user.phoneNumber && phoneNumber) user.phoneNumber = phoneNumber;

    return NextResponse.json({
      success: true,
      user,
      accessToken,
      refreshToken: refreshToken || null,
      isNewUser: !!isNewUser,
    });
  } catch (err) {
    console.error("Verify OTP proxy error:", err);
    return NextResponse.json(
      { success: false, error: "Verification failed" },
      { status: 500 }
    );
  }
}
