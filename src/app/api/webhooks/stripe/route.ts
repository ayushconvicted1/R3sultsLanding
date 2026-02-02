import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { insertOrder, type OrderInput } from "@/lib/orders";
import type { OrderLineItem } from "@/lib/mongodb";

function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
  return new Stripe(key, { apiVersion: "2026-01-28.clover" });
}

interface StoredLineItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  description?: string;
  size?: string;
  color?: string;
  productDescription?: string;
}

export async function POST(request: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET is not set");
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 503 }
    );
  }
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });
  }
  let body: string;
  try {
    body = await request.text();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  let event: Stripe.Event;
  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Webhook signature verification failed";
    console.error("Stripe webhook error:", message);
    return NextResponse.json({ error: message }, { status: 400 });
  }
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    try {
      let shippingAddress: OrderInput["shipping_address"] = {};
      if (session.metadata?.shippingAddress) {
        try {
          shippingAddress =
            typeof session.metadata.shippingAddress === "string"
              ? (JSON.parse(session.metadata.shippingAddress) as OrderInput["shipping_address"])
              : (session.metadata.shippingAddress as OrderInput["shipping_address"]);
        } catch {
          // ignore
        }
      }

      let lineItems: OrderLineItem[] = [];
      const lineItemsFullRaw = session.metadata?.lineItemsFull;
      if (lineItemsFullRaw && typeof lineItemsFullRaw === "string") {
        try {
          const stored = JSON.parse(lineItemsFullRaw) as StoredLineItem[];
          lineItems = stored.map((item) => ({
            productId: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            amount_total: Math.round(item.price * item.quantity * 100) / 100,
            image: item.image,
            description: item.description,
            size: item.size,
            color: item.color,
            productDescription: item.productDescription,
          }));
        } catch {
          // fall through to Stripe line_items
        }
      }
      if (lineItems.length === 0 && session.line_items?.data) {
        for (const li of session.line_items.data) {
          const meta = (li as { price?: { product?: string }; metadata?: Record<string, string> }).metadata;
          const price = ((li.amount_total ?? 0) / 100) / (li.quantity ?? 1);
          const amountDollars = Math.round((li.amount_total ?? 0) / 100 * 100) / 100;
          lineItems.push({
            productId: meta?.productId ?? "",
            name: (li.description ?? "Item") as string,
            quantity: li.quantity ?? 0,
            amount_total: amountDollars,
            price,
          });
        }
      }

      const amountTotalDollars = Number((((session.amount_total ?? 0) / 100).toFixed(2)));
      const order: OrderInput = {
        id: `ord_${Date.now()}_${session.id.slice(-8)}`,
        stripe_session_id: session.id,
        customer_email: session.customer_email ?? session.customer_details?.email ?? "",
        amount_total: amountTotalDollars,
        currency: (session.currency ?? "usd").toLowerCase(),
        payment_status: session.payment_status ?? "paid",
        shipping_address: shippingAddress,
        line_items: lineItems,
        created_at: new Date().toISOString(),
      };
      await insertOrder(order);
    } catch (err) {
      console.error("Failed to store order:", err);
      return NextResponse.json(
        { error: "Failed to store order" },
        { status: 500 }
      );
    }
  }
  return NextResponse.json({ received: true });
}
