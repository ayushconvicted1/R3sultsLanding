import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getChunkedMetadataValue } from "@/lib/stripe-metadata";

function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
  return new Stripe(key, { apiVersion: "2026-01-28.clover" });
}

export async function GET(request: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: "Stripe is not configured" },
      { status: 503 }
    );
  }
  const sessionId = request.nextUrl.searchParams.get("session_id");
  if (!sessionId) {
    return NextResponse.json(
      { error: "session_id is required" },
      { status: 400 }
    );
  }
  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items"],
    });
    const meta = (session.metadata ?? {}) as Record<string, string>;
    let orderSummary: { lineItemsFull?: Array<{ name: string; quantity: number; price: number; image?: string; size?: string; color?: string }>; shippingAddress?: unknown; shippingAmount?: number } = {};
    const lineItemsFullRaw = getChunkedMetadataValue(meta, "lineItemsFull");
    if (lineItemsFullRaw) {
      try {
        const parsed = JSON.parse(lineItemsFullRaw) as Array<{ name?: string; quantity?: number; price?: number; image?: string; size?: string; color?: string }>;
        orderSummary.lineItemsFull = parsed.map((item) => ({
          name: item.name ?? "Item",
          quantity: item.quantity ?? 0,
          price: item.price ?? 0,
          image: item.image,
          size: item.size,
          color: item.color,
        }));
      } catch {
        // ignore
      }
    }
    const shippingAddressRaw = getChunkedMetadataValue(meta, "shippingAddress");
    if (shippingAddressRaw) {
      try {
        orderSummary.shippingAddress = JSON.parse(shippingAddressRaw);
      } catch {
        // ignore
      }
    }
    const shippingAmountRaw = getChunkedMetadataValue(meta, "shippingAmount");
    if (shippingAmountRaw != null && shippingAmountRaw !== "") {
      const n = Number.parseFloat(shippingAmountRaw);
      if (Number.isFinite(n)) orderSummary.shippingAmount = Math.round(n * 100) / 100;
    }
    return NextResponse.json({
      session: {
        id: session.id,
        payment_status: session.payment_status,
        customer_email: session.customer_email,
        metadata: session.metadata,
        amount_total: session.amount_total,
        line_items: session.line_items?.data?.map((li) => ({
          description: li.description,
          quantity: li.quantity,
          amount_total: li.amount_total,
        })),
        orderSummary,
      },
    });
  } catch (err) {
    console.error("Session retrieve error:", err);
    return NextResponse.json(
      { error: "Failed to load session" },
      { status: 500 }
    );
  }
}
