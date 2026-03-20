import { NextRequest, NextResponse } from "next/server";
import { createOrder } from "@/lib/printify-api";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const shopId = body.shop_id ?? process.env.PRINTIFY_SHOP_ID;
    if (!shopId) {
      return NextResponse.json(
        { success: false, error: "shop_id is required" },
        { status: 400 }
      );
    }
    const lineItems = body.line_items;
    if (!Array.isArray(lineItems) || lineItems.length === 0) {
      return NextResponse.json(
        { success: false, error: "line_items array is required" },
        { status: 400 }
      );
    }
    const addressTo = body.address_to;
    if (!addressTo || typeof addressTo !== "object") {
      return NextResponse.json(
        { success: false, error: "address_to is required" },
        { status: 400 }
      );
    }
    const required = ["first_name", "last_name", "email", "country", "address1", "city", "zip"];
    for (const key of required) {
      if (!addressTo[key] || typeof addressTo[key] !== "string") {
        return NextResponse.json(
          { success: false, error: `address_to.${key} is required` },
          { status: 400 }
        );
      }
    }
    const shippingMethod = Number(body.shipping_method);
    if (![1, 2, 3, 4].includes(shippingMethod)) {
      return NextResponse.json(
        { success: false, error: "shipping_method must be 1, 2, 3, or 4" },
        { status: 400 }
      );
    }
    const addressPayload: Record<string, string> = {
      first_name: String(addressTo.first_name),
      last_name: String(addressTo.last_name),
      email: String(addressTo.email),
      country: String(addressTo.country),
      address1: String(addressTo.address1),
      city: String(addressTo.city),
      zip: String(addressTo.zip),
    };
    if (addressTo.phone) addressPayload.phone = String(addressTo.phone);
    if (addressTo.region) addressPayload.region = String(addressTo.region);
    if (addressTo.address2) addressPayload.address2 = String(addressTo.address2);

    const payload = {
      external_id: body.external_id ?? `merch-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      label: body.label,
      line_items: lineItems.map((item: { product_id: string; variant_id: number; quantity: number }) => ({
        product_id: String(item.product_id),
        variant_id: Number(item.variant_id),
        quantity: Math.max(1, Math.min(99, Number(item.quantity) || 1)),
      })),
      shipping_method: shippingMethod,
      address_to: addressPayload,
      send_shipping_notification: body.send_shipping_notification !== false,
    };
    const { id: orderId, error } = await createOrder(String(shopId), payload);
    if (error) {
      return NextResponse.json(
        { success: false, error },
        { status: 400 }
      );
    }
    return NextResponse.json({
      success: true,
      data: { order_id: orderId, external_id: payload.external_id },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Order failed";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
