import { NextRequest, NextResponse } from "next/server";
import { getUsersCollection, type UserDocument, type UserAddress } from "@/lib/mongodb";
import { hashPassword, signToken } from "@/lib/auth";

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      email,
      password,
      firstName,
      lastName,
      phone,
      line1,
      line2,
      city,
      state,
      postalCode,
      country,
    } = body;

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: "Email, password, first name, and last name are required" },
        { status: 400 }
      );
    }
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const address: UserAddress = {
      line1: line1 ?? "",
      line2: line2 ?? "",
      city: city ?? "",
      state: state ?? "",
      postalCode: postalCode ?? "",
      country: country ?? "US",
    };

    const coll = await getUsersCollection();
    const normalized = normalizeEmail(email);
    const existing = await coll.findOne({ email: normalized });
    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);
    const now = new Date().toISOString();
    const userDoc = {
      email: normalized,
      passwordHash,
      firstName: String(firstName).trim(),
      lastName: String(lastName).trim(),
      phone: phone ? String(phone).trim() : "",
      address,
      createdAt: now,
      updatedAt: now,
    };
    await coll.insertOne(userDoc);

    const token = await signToken({
      sub: normalized,
      email: normalized,
      firstName: userDoc.firstName,
      lastName: userDoc.lastName,
    });

    return NextResponse.json({
      token,
      user: {
        email: userDoc.email,
        firstName: userDoc.firstName,
        lastName: userDoc.lastName,
        phone: userDoc.phone,
        address: userDoc.address,
      },
    });
  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json({ error: "Signup failed" }, { status: 500 });
  }
}
