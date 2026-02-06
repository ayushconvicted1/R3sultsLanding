import { NextRequest, NextResponse } from "next/server";
import { getUsersCollection } from "@/lib/mongodb";
import { hashPassword } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, newPassword } = body;
    if (!token || !newPassword) {
      return NextResponse.json(
        { error: "Token and new password are required" },
        { status: 400 }
      );
    }
    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const coll = await getUsersCollection();
    const user = await coll.findOne({ resetToken: token });
    if (!user) {
      return NextResponse.json({ error: "Invalid or expired reset link" }, { status: 400 });
    }
    const expiry = user.resetTokenExpiry ? new Date(user.resetTokenExpiry).getTime() : 0;
    if (Date.now() > expiry) {
      await coll.updateOne(
        { email: user.email },
        { $unset: { resetToken: "", resetTokenExpiry: "" }, $set: { updatedAt: new Date().toISOString() } }
      );
      return NextResponse.json({ error: "Reset link has expired" }, { status: 400 });
    }

    const passwordHash = await hashPassword(newPassword);
    await coll.updateOne(
      { email: user.email },
      {
        $set: { passwordHash, updatedAt: new Date().toISOString() },
        $unset: { resetToken: "", resetTokenExpiry: "" },
      }
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Reset password error:", err);
    return NextResponse.json({ error: "Failed to reset password" }, { status: 500 });
  }
}
