import { NextRequest, NextResponse } from "next/server";
import { getUsersCollection } from "@/lib/mongodb";
import { verifyToken } from "@/lib/auth";

function getBearerToken(request: NextRequest): string | null {
  const auth = request.headers.get("authorization");
  if (auth?.startsWith("Bearer ")) return auth.slice(7);
  return null;
}

export async function GET(request: NextRequest) {
  const token = getBearerToken(request);
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const payload = await verifyToken(token);
  if (!payload) {
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
  }

  const coll = await getUsersCollection();
  const user = await coll.findOne({ email: payload.email });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({
    user: {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      address: user.address,
    },
  });
}

export async function PATCH(request: NextRequest) {
  const token = getBearerToken(request);
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const payload = await verifyToken(token);
  if (!payload) {
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
  }

  const body = await request.json();
  const { firstName, lastName, phone, address } = body;

  const coll = await getUsersCollection();
  const update: Record<string, unknown> = { updatedAt: new Date().toISOString() };
  if (typeof firstName === "string") update.firstName = firstName.trim();
  if (typeof lastName === "string") update.lastName = lastName.trim();
  if (typeof phone === "string") update.phone = phone.trim();
  if (address && typeof address === "object") {
    update.address = {
      line1: address.line1 ?? "",
      line2: address.line2 ?? "",
      city: address.city ?? "",
      state: address.state ?? "",
      postalCode: address.postalCode ?? "",
      country: address.country ?? "US",
    };
  }

  const result = await coll.findOneAndUpdate(
    { email: payload.email },
    { $set: update },
    { returnDocument: "after" }
  );
  if (!result) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({
    user: {
      email: result.email,
      firstName: result.firstName,
      lastName: result.lastName,
      phone: result.phone,
      address: result.address,
    },
  });
}
