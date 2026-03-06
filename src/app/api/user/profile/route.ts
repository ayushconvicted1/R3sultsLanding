import { NextRequest, NextResponse } from "next/server";
import { userApiFetch } from "@/lib/user-api";
import { normalizeUser } from "@/lib/normalize-user";

function getBearerToken(request: NextRequest): string | null {
  const auth = request.headers.get("authorization");
  if (auth?.startsWith("Bearer ")) return auth.slice(7);
  return null;
}

/**
 * GET /api/user/profile – Proxy to external GET /api/user/profile (full profile with propertyPhotos and groups).
 */
export async function GET(request: NextRequest) {
  const token = getBearerToken(request);
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await userApiFetch<{ success?: boolean; data?: { user?: Record<string, unknown> }; error?: string }>(
    "/api/user/profile",
    { method: "GET", token }
  );

  if (!result.success || result.status === 401) {
    return NextResponse.json(
      { error: (result.data as { error?: string })?.error || "Invalid or expired token" },
      { status: 401 }
    );
  }

  const data = result.data as { data?: { user?: Record<string, unknown> }; user?: Record<string, unknown> };
  const rawUser = data?.data?.user ?? data?.user;
  const user = normalizeUser(rawUser);
  return NextResponse.json({ success: true, user });
}

/**
 * PATCH /api/user/profile – Proxy to external PATCH /api/user/profile.
 * Body: fullName, username, email, dateOfBirth, gender, profilePictureUrl (per API_USAGE.csv).
 */
export async function PATCH(request: NextRequest) {
  const token = getBearerToken(request);
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const allowed = [
    "fullName",
    "username",
    "email",
    "dateOfBirth",
    "gender",
    "profilePictureUrl",
  ] as const;
  const externalBody: Record<string, unknown> = {};
  for (const key of allowed) {
    if (body[key] !== undefined) externalBody[key] = body[key];
  }

  const result = await userApiFetch<{ success?: boolean; data?: { user?: Record<string, unknown> }; error?: string }>(
    "/api/user/profile",
    { method: "PATCH", body: externalBody, token }
  );

  if (!result.success) {
    return NextResponse.json(
      { error: (result.data as { error?: string })?.error || "Update failed" },
      { status: result.status >= 400 ? result.status : 500 }
    );
  }

  const patchData = result.data as { data?: { user?: Record<string, unknown> }; user?: Record<string, unknown> };
  const rawUser = patchData?.data?.user ?? patchData?.user;
  const user = normalizeUser(rawUser);
  return NextResponse.json({ success: true, user });
}
