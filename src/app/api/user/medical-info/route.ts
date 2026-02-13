import { NextRequest, NextResponse } from "next/server";
import { userApiFetch } from "@/lib/user-api";
import { normalizeUser } from "@/lib/normalize-user";

function getBearerToken(request: NextRequest): string | null {
  const auth = request.headers.get("authorization");
  if (auth?.startsWith("Bearer ")) return auth.slice(7);
  return null;
}

/**
 * PATCH /api/user/medical-info – Proxy to external PATCH /api/user/medical-info.
 * Body: bloodGroup, medicalConditions (per API_USAGE.csv).
 */
export async function PATCH(request: NextRequest) {
  const token = getBearerToken(request);
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const externalBody: Record<string, unknown> = {};
  if (body.bloodGroup !== undefined) externalBody.bloodGroup = body.bloodGroup;
  if (body.medicalConditions !== undefined) externalBody.medicalConditions = body.medicalConditions;

  const result = await userApiFetch<{ success?: boolean; data?: { user?: Record<string, unknown> }; error?: string }>(
    "/api/user/medical-info",
    { method: "PATCH", body: externalBody, token }
  );

  if (!result.success) {
    return NextResponse.json(
      { error: (result.data as { error?: string })?.error || "Update failed" },
      { status: result.status >= 400 ? result.status : 500 }
    );
  }

  const rawUser =
    (result.data as Record<string, unknown>)?.data?.user ?? (result.data as Record<string, unknown>)?.user;
  const user = normalizeUser(rawUser as Record<string, unknown> | undefined);
  return NextResponse.json({ success: true, user });
}
