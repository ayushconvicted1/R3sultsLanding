import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import type { CreateCheckoutBody } from "@/types/checkout";
import type { ShippingAddress } from "@/types/checkout";
import { buildChunkedMetadata } from "@/lib/stripe-metadata";

function formatAddressSummary(label: string, addr: ShippingAddress): string {
  const name = [addr.firstName, addr.lastName].filter(Boolean).join(" ");
  const line = [addr.line1, addr.line2].filter(Boolean).join(", ");
  const cityState = [addr.city, addr.state].filter(Boolean).join(", ");
  const postal = addr.postalCode ? ` ${addr.postalCode}` : "";
  const country = addr.country || "";
  const parts = [name, line, cityState + postal, country].filter(Boolean);
  return `${label}: ${parts.join(" · ")}`;
}

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
    const { lineItems, shippingAddress, billingSameAsShipping, billingAddress, shippingAmount } = body;
    const resolvedBilling = billingSameAsShipping ? shippingAddress : billingAddress;

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

    const shippingAmountNum = typeof shippingAmount === "number" && shippingAmount >= 0 ? shippingAmount : 0;
    const lineItemsStripe = [
      ...lineItems.map((item) => ({
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
      ...(shippingAmountNum > 0
        ? [{
            price_data: {
              currency: "usd",
              product_data: {
                name: "Shipping",
                description: "Standard shipping",
              },
              unit_amount: Math.round(shippingAmountNum * 100), // cents
            },
            quantity: 1,
          }]
        : []),
    ];
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: lineItemsStripe,
      customer_email: shippingAddress.email,
      billing_address_collection: "required",
      shipping_address_collection: {
        allowed_countries: ["US", "CA", "GB", "IN", "AU", "DE", "FR"],
      },
      custom_text: {
        shipping_address: {
          message: (formatAddressSummary("Shipping", shippingAddress) + "\n\n" + formatAddressSummary("Billing", resolvedBilling ?? shippingAddress)).slice(0, 1200),
        },
      },
      metadata: buildChunkedMetadata(
        Object.fromEntries(
          Object.entries({
            shippingAddress: JSON.stringify(shippingAddress),
            lineItemsFull: JSON.stringify(lineItems),
            customerPhone: shippingAddress.phone || undefined,
            billingAddress: resolvedBilling ? JSON.stringify(resolvedBilling) : undefined,
            billingSameAsShipping: String(!!billingSameAsShipping),
            shippingAmount: shippingAmount != null ? String(shippingAmount) : undefined,
          }).filter(([, v]) => v != null && v !== "")
        ) as Record<string, string>
      ),
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout/cancel`,
    });

    try {
      await stripe.checkout.sessions.update(session.id, {
        collected_information: {
          shipping_details: {
            address: {
              line1: shippingAddress.line1,
              line2: shippingAddress.line2 || undefined,
              city: shippingAddress.city,
              state: shippingAddress.state,
              postal_code: shippingAddress.postalCode,
              country: shippingAddress.country,
            },
            name: [shippingAddress.firstName, shippingAddress.lastName].filter(Boolean).join(" ") || "Customer",
          },
        },
      });
    } catch {
      // Prefill may only work for embedded/custom mode; hosted Checkout still shows custom_text with addresses
    }

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (err) {
    console.error("Checkout session error:", err);
    const message = err instanceof Error ? err.message : "Checkout failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
