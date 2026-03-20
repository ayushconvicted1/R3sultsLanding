import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { buildChunkedMetadata } from "@/lib/stripe-metadata";

function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
  return new Stripe(key, { apiVersion: "2026-01-28.clover" });
}

type MerchItem = {
  product_id: string;
  variant_id: number;
  quantity: number;
  product_title?: string;
  variant_label?: string;
  image_url?: string;
  price: number; // cents
};

type MerchAddress = {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  country: string;
  region?: string;
  address1: string;
  address2?: string;
  city: string;
  zip: string;
};

export async function POST(request: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: "Stripe is not configured (STRIPE_SECRET_KEY missing)" },
      { status: 503 }
    );
  }
  try {
    const body = await request.json();
    const items = body.items as MerchItem[] | undefined;
    const address = body.address as MerchAddress | undefined;
    const shippingMethod = Number(body.shipping_method);
    const shippingUsd = Number(body.shipping_usd);

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "items required" }, { status: 400 });
    }
    if (!address?.email?.trim() || !address.first_name?.trim() || !address.last_name?.trim()) {
      return NextResponse.json({ error: "address with email and name required" }, { status: 400 });
    }
    if (![1, 2, 3, 4].includes(shippingMethod)) {
      return NextResponse.json({ error: "shipping_method invalid" }, { status: 400 });
    }
    if (!Number.isFinite(shippingUsd) || shippingUsd < 0) {
      return NextResponse.json({ error: "shipping_usd invalid" }, { status: 400 });
    }

    for (const it of items) {
      if (!it.product_id || !Number.isFinite(it.variant_id) || !Number.isFinite(it.quantity)) {
        return NextResponse.json({ error: "invalid line item" }, { status: 400 });
      }
      if (!Number.isFinite(it.price) || it.price < 0) {
        return NextResponse.json({ error: "each item must include price in cents" }, { status: 400 });
      }
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
    const origin = baseUrl.startsWith("http") ? baseUrl : `https://${baseUrl}`;

    const lineItemsStripe: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map((item) => {
      const name =
        [item.product_title ?? "Merch item", item.variant_label].filter(Boolean).join(" · ") ||
        "Merch item";
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: name.slice(0, 120),
            ...(item.image_url && /^https?:\/\//i.test(item.image_url)
              ? { images: [item.image_url.slice(0, 2048)] }
              : {}),
          },
          unit_amount: Math.round(item.price),
        },
        quantity: Math.max(1, Math.min(99, Math.floor(item.quantity))),
      };
    });

    if (shippingUsd > 0) {
      lineItemsStripe.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: "Shipping",
            description: `Printify shipping method ${shippingMethod}`,
          },
          unit_amount: Math.round(shippingUsd * 100),
        },
        quantity: 1,
      });
    }

    const printifyPayload = {
      line_items: items.map((i) => ({
        product_id: String(i.product_id),
        variant_id: Number(i.variant_id),
        quantity: Math.max(1, Math.min(99, Math.floor(i.quantity))),
      })),
      address_to: {
        first_name: String(address.first_name).trim(),
        last_name: String(address.last_name).trim(),
        email: String(address.email).trim(),
        country: String(address.country).trim(),
        address1: String(address.address1).trim(),
        city: String(address.city).trim(),
        zip: String(address.zip).trim(),
        ...(address.phone?.trim() && { phone: address.phone.trim() }),
        ...(address.region?.trim() && { region: address.region.trim() }),
        ...(address.address2?.trim() && { address2: address.address2.trim() }),
      },
      shipping_method: shippingMethod,
    };

    const merchOrderJson = JSON.stringify(printifyPayload);
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: lineItemsStripe,
      customer_email: address.email.trim(),
      metadata: buildChunkedMetadata({
        merch: "1",
        merchOrder: merchOrderJson,
      }),
      success_url: `${origin}/merch/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/merch/checkout`,
    });

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (err) {
    console.error("Merch Stripe checkout:", err);
    const message = err instanceof Error ? err.message : "Checkout failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
