import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import type { CreateCheckoutBody } from "@/types/checkout";

function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
  return new Stripe(key, { apiVersion: "2026-01-28.clover" });
}

export async function POST(request: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: "Stripe is not configured (STRIPE_SECRET_KEY missing)" },
      { status: 503 }
    );
  }
  try {
    const stripe = getStripe();
    const body: CreateCheckoutBody = await request.json();
    const { lineItems, shippingAddress } = body;

    if (!lineItems?.length || !shippingAddress?.email) {
      return NextResponse.json(
        { error: "Line items and shipping address with email are required" },
        { status: 400 }
      );
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000";
    const origin = baseUrl.startsWith("http") ? baseUrl : `https://${baseUrl}`;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: lineItems.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
            description: item.description ?? (item.size || item.color ? `Quantity: ${item.quantity}${item.size ? ` • Size: ${item.size}` : ""}${item.color ? ` • Color: ${item.color}` : ""}`.trim() : undefined),
            images: item.image ? [item.image] : undefined,
            metadata: {
              productId: item.productId,
              ...(item.size && { size: item.size }),
              ...(item.color && { color: item.color }),
            },
          },
          unit_amount: Math.round(item.price * 100), // cents
        },
        quantity: item.quantity,
      })),
      customer_email: shippingAddress.email,
      metadata: {
        shippingAddress: JSON.stringify(shippingAddress),
        lineItemsFull: JSON.stringify(lineItems),
      },
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout/cancel`,
    });

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (err) {
    console.error("Checkout session error:", err);
    const message = err instanceof Error ? err.message : "Checkout failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
