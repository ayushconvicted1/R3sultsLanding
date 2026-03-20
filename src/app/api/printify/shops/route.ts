import { NextResponse } from "next/server";
import { getShops } from "@/lib/printify-api";

export async function GET() {
  try {
    const shops = await getShops();
    return NextResponse.json({
      success: true,
      data: { shops },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to fetch shops";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
