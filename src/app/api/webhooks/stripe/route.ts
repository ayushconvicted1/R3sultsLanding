import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { insertOrder, type OrderInput } from "@/lib/orders";
import type { OrderLineItem } from "@/lib/mongodb";
import { getChunkedMetadataValue } from "@/lib/stripe-metadata";
import { generateOrderId } from "@/lib/order-id";
import { sendOrderConfirmationEmail } from "@/lib/order-email";

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

function splitName(full: string): { firstName?: string; lastName?: string } {
  const parts = full.trim().split(/\s+/);
  if (parts.length === 0) return {};
  if (parts.length === 1) return { firstName: parts[0] };
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
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
    const meta = (session.metadata ?? {}) as Record<string, string>;
    try {
      let shippingAddress: OrderInput["shipping_address"] = {};
      const shippingAddressRaw = getChunkedMetadataValue(meta, "shippingAddress");
      if (shippingAddressRaw) {
        try {
          shippingAddress = JSON.parse(shippingAddressRaw) as OrderInput["shipping_address"];
        } catch {
          // ignore
        }
      }
      const stripeShipping = (session.customer_details as { shipping_details?: { address?: Stripe.Address; name?: string } })?.shipping_details;
      if (stripeShipping?.address?.line1) {
        shippingAddress = {
          ...shippingAddress,
          line1: stripeShipping.address.line1 ?? shippingAddress.line1,
          line2: stripeShipping.address.line2 ?? shippingAddress.line2,
          city: stripeShipping.address.city ?? shippingAddress.city,
          state: stripeShipping.address.state ?? shippingAddress.state,
          postalCode: stripeShipping.address.postal_code ?? shippingAddress.postalCode,
          country: stripeShipping.address.country ?? shippingAddress.country,
          ...(stripeShipping.name && splitName(stripeShipping.name)),
        };
      }
      if (!shippingAddress.phone) {
        shippingAddress.phone =
          (session.customer_details as { phone?: string } | undefined)?.phone ??
          getChunkedMetadataValue(meta, "customerPhone");
      }

      let billing_address: OrderInput["billing_address"] | undefined;
      const stripeBilling = (session.customer_details as { address?: Stripe.Address })?.address;
      if (stripeBilling?.line1) {
        billing_address = {
          line1: stripeBilling.line1 ?? undefined,
          line2: stripeBilling.line2 ?? undefined,
          city: stripeBilling.city ?? undefined,
          state: stripeBilling.state ?? undefined,
          postalCode: stripeBilling.postal_code ?? undefined,
          country: stripeBilling.country ?? undefined,
        };
      }
      if (!billing_address) {
        const billingAddressRaw = getChunkedMetadataValue(meta, "billingAddress");
        if (billingAddressRaw) {
          try {
            billing_address = JSON.parse(billingAddressRaw) as OrderInput["billing_address"];
          } catch {
            // ignore
          }
        }
      }
      const billing_same_as_shipping = getChunkedMetadataValue(meta, "billingSameAsShipping") === "true";

      let lineItems: OrderLineItem[] = [];
      const lineItemsFullRaw = getChunkedMetadataValue(meta, "lineItemsFull");
      if (lineItemsFullRaw) {
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
      const shippingAmountNum = (() => {
        const raw = getChunkedMetadataValue(meta, "shippingAmount");
        if (raw == null || raw === "") return undefined;
        const n = Number.parseFloat(raw);
        return Number.isFinite(n) ? Math.round(n * 100) / 100 : undefined;
      })();
      const subtotal = shippingAmountNum != null ? Math.round((amountTotalDollars - shippingAmountNum) * 100) / 100 : amountTotalDollars;
      const order: OrderInput = {
        id: generateOrderId(),
        stripe_session_id: session.id,
        customer_email: session.customer_email ?? session.customer_details?.email ?? "",
        amount_total: amountTotalDollars,
        ...(shippingAmountNum != null && { amount_subtotal: subtotal, shipping_amount: shippingAmountNum }),
        currency: (session.currency ?? "usd").toLowerCase(),
        payment_status: session.payment_status ?? "paid",
        shipping_address: shippingAddress,
        ...(billing_address && { billing_address }),
        ...(billing_same_as_shipping && { billing_same_as_shipping: true }),
        line_items: lineItems,
        created_at: new Date().toISOString(),
      };
      await insertOrder(order);
      try {
        await sendOrderConfirmationEmail(order);
      } catch (emailErr) {
        console.error("Order confirmation email failed:", emailErr);
      }
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
