import { getUserApiBaseUrl } from "./user-api";

/** Request body for POST /api/shop/orders (backend stores orders; no MongoDB). */
export interface CreateShopOrderBody {
  lineItems: Array<{
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
    size?: string;
    color?: string;
  }>;
  shippingAddress: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  billingAddress?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  billingSameAsShipping?: boolean;
  shippingAmount?: number;
}

/** Order payload we have in webhook (OrderInput-like). */
export interface OrderPayload {
  shipping_address: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  billing_address?: {
    firstName?: string;
    lastName?: string;
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  billing_same_as_shipping?: boolean;
  shipping_amount?: number;
  customer_email: string;
  line_items: Array<{
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
    size?: string;
    color?: string;
  }>;
}

/**
 * Build and POST order to backend Shop Orders API (domain from env). No MongoDB.
 */
export async function createOrderOnBackend(order: OrderPayload): Promise<{ orderId?: string; success: boolean; error?: string }> {
  const base = getUserApiBaseUrl();
  const url = `${base}/api/shop/orders`;

  const shipping = order.shipping_address;
  const shippingAddress = {
    firstName: shipping?.firstName ?? "",
    lastName: shipping?.lastName ?? "",
    email: shipping?.email ?? order.customer_email ?? "",
    phone: shipping?.phone ?? "",
    line1: shipping?.line1 ?? "",
    line2: shipping?.line2 ?? "",
    city: shipping?.city ?? "",
    state: shipping?.state ?? "",
    postalCode: shipping?.postalCode ?? "",
    country: shipping?.country ?? "",
  };

  if (!shippingAddress.email || !shippingAddress.phone) {
    return { success: false, error: "Shipping address must include email and phone" };
  }

  const body: CreateShopOrderBody = {
    lineItems: order.line_items.map((item) => ({
      productId: item.productId,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      ...(item.image && { image: item.image }),
      ...(item.size && { size: item.size }),
      ...(item.color && { color: item.color }),
    })),
    shippingAddress,
    ...(order.billing_same_as_shipping !== undefined && { billingSameAsShipping: order.billing_same_as_shipping }),
    ...(order.shipping_amount != null && order.shipping_amount > 0 && { shippingAmount: order.shipping_amount }),
  };

  const billing = order.billing_address;
  if (billing && (billing.line1 || billing.city)) {
    body.billingAddress = {
      firstName: billing.firstName,
      lastName: billing.lastName,
      line1: billing.line1 ?? "",
      line2: billing.line2,
      city: billing.city ?? "",
      state: billing.state ?? "",
      postalCode: billing.postalCode ?? "",
      country: billing.country ?? "",
    };
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const msg = (data as { error?: string; message?: string }).error ?? (data as { message?: string }).message ?? `HTTP ${res.status}`;
      return { success: false, error: msg };
    }
    const orderId = (data as { data?: { orderId?: string } }).data?.orderId;
    return { success: true, orderId };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Request failed";
    return { success: false, error: message };
  }
}
