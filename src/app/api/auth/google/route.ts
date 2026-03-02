import { NextRequest, NextResponse } from "next/server";
import { userApiFetch } from "@/lib/user-api";
import { normalizeUser } from "@/lib/normalize-user";
import type { AppUser } from "@/types/user";

/**
 * Proxy to external User API: POST /api/auth/google (Google Sign-In).
 * Body: { idToken: string } — Google ID token from client SDK.
 * Returns: { user, accessToken, refreshToken, needsPhoneUpdate? }
 * If needsPhoneUpdate is true, prompt user to add phone via POST /auth/update-phone.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { idToken } = body;
    if (!idToken || typeof idToken !== "string") {
      return NextResponse.json(
        { success: false, error: "idToken is required" },
        { status: 400 }
      );
    }

    const result = await userApiFetch<{
      success?: boolean;
      data?: {
        user?: Record<string, unknown>;
        accessToken?: string;
        refreshToken?: string;
        needsPhoneUpdate?: boolean;
      };
      error?: string;
    }>("/api/auth/google", {
      method: "POST",
      body: { idToken },
    });

    if (!result.success) {
      const message = result.error || (result.data as { message?: string })?.message || "Google sign-in failed";
      return NextResponse.json(
        { success: false, error: message },
        { status: result.status === 401 ? 401 : result.status >= 400 ? result.status : 500 }
      );
    }

    const data = result.data as {
      data?: {
        user?: Record<string, unknown>;
        accessToken?: string;
        refreshToken?: string;
        needsPhoneUpdate?: boolean;
      };
    };
    const inner = data?.data;
    const rawUser = inner?.user;
    const accessToken = inner?.accessToken;
    const refreshToken = inner?.refreshToken;
    const needsPhoneUpdate = inner?.needsPhoneUpdate;

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
      needsPhoneUpdate: !!needsPhoneUpdate,
    });
  } catch (err) {
    console.error("Google auth proxy error:", err);
    return NextResponse.json(
      { success: false, error: "Google sign-in failed" },
      { status: 500 }
    );
  }
}
