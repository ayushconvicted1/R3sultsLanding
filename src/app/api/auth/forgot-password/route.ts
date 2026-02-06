import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { getUsersCollection } from "@/lib/mongodb";
import { sendPasswordResetEmail } from "@/lib/send-reset-email";

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;
    if (!email || !String(email).trim()) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const coll = await getUsersCollection();
    const normalized = normalizeEmail(email);
    const user = await coll.findOne({ email: normalized });
    // Always return success to avoid email enumeration
    if (!user) {
      return NextResponse.json({ success: true, message: "If an account exists, you will receive a reset link." });
    }

    const resetToken = randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour
    await coll.updateOne(
      { email: normalized },
      { $set: { resetToken, resetTokenExpiry, updatedAt: new Date().toISOString() } }
    );

    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
    const origin = baseUrl.startsWith("http") ? baseUrl : `https://${baseUrl}`;
    const resetLink = `${origin}/reset-password?token=${resetToken}`;

    await sendPasswordResetEmail(user.email, resetLink);

    return NextResponse.json({ success: true, message: "If an account exists, you will receive a reset link." });
  } catch (err) {
    console.error("Forgot password error:", err);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}
