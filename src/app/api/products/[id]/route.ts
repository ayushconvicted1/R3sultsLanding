import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const domain = (process.env.DOMAIN_NAME ?? "").replace(/\/$/, "").trim();
    let token = (process.env.AUTH_TOKEN ?? "").trim();
    if (
      token.length >= 2 &&
      ((token.startsWith('"') && token.endsWith('"')) ||
        (token.startsWith("'") && token.endsWith("'")))
    ) {
      token = token.slice(1, -1).trim();
    }

    if (!domain || !token || !id) {
      return NextResponse.json(
        { error: "Missing DOMAIN_NAME, AUTH_TOKEN, or product id" },
        { status: 500 }
      );
    }

    const url = `${domain}/api/products/${id}`;
    const res = await fetch(url, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { error: "Product not found", status: res.status, body: text },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Product proxy error:", err);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}
