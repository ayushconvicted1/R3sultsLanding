import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getMerchCheckoutCollection } from "@/lib/mongodb";

function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
  return new Stripe(key, { apiVersion: "2026-01-28.clover" });
}

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get("session_id");
  if (!sessionId?.trim()) {
    return NextResponse.json({ error: "session_id required" }, { status: 400 });
  }
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }
  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["payment_intent"],
    });
    if (session.payment_status !== "paid") {
      return NextResponse.json(
        { paid: false, status: session.payment_status },
        { status: 402 }
      );
    }

    let printify_order_id: string | undefined;
    let printify_external_id: string | undefined;
    let printify_error: string | undefined;
    let pending = true;

    try {
      const col = await getMerchCheckoutCollection();
      const doc = await col.findOne({ stripe_session_id: sessionId });
      if (doc?.printify_order_id) {
        pending = false;
        printify_order_id = doc.printify_order_id;
        printify_external_id = doc.printify_external_id;
      }
      if (doc?.printify_error) {
        printify_error = doc.printify_error;
      }
    } catch {
      /* MongoDB optional — still return paid */
    }

    return NextResponse.json({
      paid: true,
      session_id: session.id,
      amount_total: (session.amount_total ?? 0) / 100,
      currency: session.currency,
      customer_email: session.customer_email ?? session.customer_details?.email,
      printify_order_id,
      printify_external_id,
      printify_error,
      printify_pending: pending && !printify_error,
    });
  } catch (e) {
    console.error("Merch session retrieve:", e);
    return NextResponse.json({ error: "Invalid session" }, { status: 400 });
  }
}
