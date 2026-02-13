import { NextRequest, NextResponse } from "next/server";
import { userApiFetch } from "@/lib/user-api";

/**
 * Proxy to external User API: POST /api/auth/refresh-token
 * Body: { refreshToken: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { refreshToken } = body;
    if (!refreshToken || typeof refreshToken !== "string") {
      return NextResponse.json(
        { success: false, error: "refreshToken is required" },
        { status: 400 }
      );
    }
    const result = await userApiFetch<{
      success?: boolean;
      data?: { accessToken?: string; refreshToken?: string };
      accessToken?: string;
      refreshToken?: string;
      error?: string;
    }>("/api/auth/refresh-token", {
      method: "POST",
      body: { refreshToken },
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || "Refresh failed" },
        { status: result.status === 401 ? 401 : 500 }
      );
    }

    const data = result.data as Record<string, unknown> | undefined;
    const d = data?.data as Record<string, unknown> | undefined;
    const accessToken = d?.accessToken ?? data?.accessToken;
    const newRefreshToken = d?.refreshToken ?? data?.refreshToken;

    if (!accessToken) {
      return NextResponse.json(
        { success: false, error: "No access token returned" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      accessToken,
      refreshToken: newRefreshToken || refreshToken,
    });
  } catch (err) {
    console.error("Refresh token proxy error:", err);
    return NextResponse.json(
      { success: false, error: "Refresh failed" },
      { status: 500 }
    );
  }
}
