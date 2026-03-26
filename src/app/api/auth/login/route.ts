import { NextRequest, NextResponse } from "next/server";
import { userApiFetch } from "@/lib/user-api";
import { normalizeUser } from "@/lib/normalize-user";
import type { AppUser } from "@/types/user";

/**
 * Proxy to external User API: POST /api/auth/login (email + password).
 * Body: { email: string, password: string }
 * Returns: { user, accessToken, refreshToken }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;
    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 }
      );
    }
    if (!password || typeof password !== "string") {
      return NextResponse.json(
        { success: false, error: "Password is required" },
        { status: 400 }
      );
    }

    const result = await userApiFetch<{
      success?: boolean;
      message?: string;
      data?: { user?: Record<string, unknown>; accessToken?: string; refreshToken?: string };
      error?: string;
    }>("/api/auth/login", {
      method: "POST",
      body: { email: email.trim().toLowerCase(), password },
    });

    if (!result.success) {
      const rawMessage =
        result.error ||
        (result.data as { message?: string })?.message ||
        "Incorrect email or password";
      const message =
        rawMessage.toLowerCase().includes("request failed") && (result.status === 401 || result.status === 403)
          ? "Incorrect email or password"
          : rawMessage;
      return NextResponse.json(
        { success: false, error: message },
        { status: result.status === 403 ? 403 : 401 }
      );
    }

    const data = result.data as { data?: { user?: Record<string, unknown>; accessToken?: string; refreshToken?: string } };
    const inner = data?.data;
    const rawUser = inner?.user;
    const accessToken = inner?.accessToken;
    const refreshToken = inner?.refreshToken;

    if (!accessToken) {
      return NextResponse.json(
        { success: false, error: "No access token returned" },
        { status: 500 }
      );
    }

    const user: AppUser = normalizeUser(rawUser as Record<string, unknown> | undefined);

    return NextResponse.json({
      success: true,
      user,
      accessToken,
      refreshToken: refreshToken ?? null,
    });
  } catch (err) {
    console.error("Login proxy error:", err);
    return NextResponse.json(
      { success: false, error: "Login failed" },
      { status: 500 }
    );
  }
}
