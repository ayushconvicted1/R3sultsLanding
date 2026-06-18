"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";
import { getStoredToken } from "@/context/AuthContext";
import type { OrderDocument } from "@/lib/mongodb";
import AuthPageWrapper from "@/components/auth/AuthPageWrapper";

/** Normalize backend GET /api/shop/orders/my response to OrderDocument-like shape for UI. */
function normalizeShopOrder(o: Record<string, unknown>): OrderDocument {
  const lineItems = (o.lineItems as OrderDocument["line_items"]) ?? [];
  const shippingAddress = (o.shippingAddress as OrderDocument["shipping_address"]) ?? {};
  return {
    id: (o.orderId as string) || (o.id as string) || "",
    stripe_session_id: "",
    customer_email: (o.customerEmail as string) ?? "",
    amount_total: Number(o.amountTotal) ?? 0,
    amount_subtotal: o.amountSubtotal != null ? Number(o.amountSubtotal) : undefined,
    shipping_amount: o.shippingAmount != null ? Number(o.shippingAmount) : undefined,
    currency: (o.currency as string) ?? "usd",
    payment_status: (o.paymentStatus as string) ?? "pending",
    shipping_address: shippingAddress,
    line_items: lineItems,
    created_at: (o.createdAt as string) ?? new Date().toISOString(),
  };
}

function formatAddress(addr: Record<string, unknown> | undefined): string {
  if (!addr) return "—";
  const first = (addr.firstName as string) || "";
  const last = (addr.lastName as string) || "";
  const full = [first, last].filter(Boolean).join(" ");
  const line1 = (addr.line1 as string) || "";
  const line2 = (addr.line2 as string) || "";
  const city = (addr.city as string) || "";
  const state = (addr.state as string) || "";
  const postal = (addr.postalCode as string) || "";
  const country = (addr.country as string) || "";
  const parts = [full, line1, line2, [city, state, postal].filter(Boolean).join(", "), country].filter(Boolean);
  return parts.join(", ") || "—";
}

export default function OrderHistoryPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<OrderDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user && !authLoading) {
      router.replace("/login");
      return;
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const token = getStoredToken();
    if (!token) {
      setLoading(false);
      return;
    }
    fetch("/api/shop/orders/my", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load orders");
        return res.json();
      })
      .then((data) => {
        const list = Array.isArray(data.data) ? data.data : [];
        setOrders(list.map((o: Record<string, unknown>) => normalizeShopOrder(o)));
      })
      .catch(() => {
        setError("Failed to load order history");
        toast.error("Failed to load order history");
      })
      .finally(() => setLoading(false));
  }, [user?.email]);

  if (authLoading || !user) {
    return (
      <AuthPageWrapper>
        <div className="max-w-4xl mx-auto text-center py-12 text-slate-500">Loading…</div>
      </AuthPageWrapper>
    );
  }

  return (
    <AuthPageWrapper>
      <div className="max-w-4xl mx-auto">
        <Link
          href="/profile"
          className="inline-flex items-center gap-2 text-slate-700 hover:text-[#BF0637] font-medium mb-6 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to profile
        </Link>
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-slate-200/80 shadow-2xl p-5 sm:p-6 mb-5">
          <h1 className="text-2xl font-bold text-slate-900 mb-0.5">Order history</h1>
          <p className="text-slate-600 text-sm">
            Orders for <strong>{user.email}</strong>
          </p>
        </div>

        {loading && (
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-slate-200/80 shadow-2xl p-10 text-center text-slate-500">
            Loading orders…
          </div>
        )}
        {error && !loading && (
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl border-2 border-red-200 bg-red-50/80 p-8 text-center text-red-700 font-medium">
            {error}
          </div>
        )}
        {!loading && !error && orders.length === 0 && (
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-slate-200/80 shadow-2xl p-12 text-center">
            <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">No orders yet</h2>
            <p className="text-slate-600 mb-6">Orders placed with this email will appear here.</p>
            <Link
              href="/shop"
              className="inline-block px-6 py-3 rounded-xl font-semibold text-white"
              style={{ backgroundColor: "#BF0637" }}
            >
              Shop now
            </Link>
          </div>
        )}
        {!loading && !error && orders.length > 0 && (
          <ul className="space-y-6">
            {orders.map((order) => {
              const date = order.created_at
                ? new Date(order.created_at).toLocaleDateString("en-US", { dateStyle: "long" })
                : "";
              const time = order.created_at
                ? new Date(order.created_at).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
                : "";
              const shippingAmount = order.shipping_amount ?? 0;
              const subtotal = order.amount_subtotal ?? Math.round((order.amount_total - shippingAmount) * 100) / 100;
              const ship = order.shipping_address ?? {};
              const bill = order.billing_address;
              return (
                <li
                  key={order.id}
                  className="bg-white/95 backdrop-blur-sm rounded-2xl border border-slate-200/80 shadow-2xl overflow-hidden"
                >
                  <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <span className="font-mono font-bold text-slate-900 text-lg">{order.id}</span>
                      <Link
                        href={`/account/orders/${encodeURIComponent(order.id)}`}
                        className="ml-3 text-sm font-medium text-[#BF0637] hover:underline"
                      >
                        View details
                      </Link>
                      <span className="ml-3 text-slate-600 text-sm">{date} at {time}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1.5 rounded-full text-sm font-semibold ${
                          order.payment_status === "paid"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {order.payment_status}
                      </span>
                      <span className="text-xl font-bold text-[#BF0637]">
                        ${(order.amount_total ?? 0).toFixed(2)} {order.currency?.toUpperCase() ?? "USD"}
                      </span>
                    </div>
                  </div>
                  <div className="p-6 space-y-6">
                    <ul className="space-y-4">
                      <p className="text-sm font-bold text-slate-700 uppercase tracking-wide">Items</p>
                      {(order.line_items ?? []).map((item, idx) => {
                        const lineTotal = (item.price ?? 0) * (item.quantity ?? 0);
                        return (
                          <li key={`${order.id}-${idx}`} className="flex gap-4 pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                            <div className="relative w-24 h-24 shrink-0 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                              {item.image ? (
                                <Image
                                  src={item.image}
                                  alt={item.name ?? "Item"}
                                  fill
                                  className="object-cover"
                                  unoptimized={item.image.startsWith("http")}
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                                  No image
                                </div>
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-semibold text-slate-900">{item.name ?? "Item"}</p>
                              <p className="text-slate-500 text-sm">
                                Qty: {item.quantity} × ${(item.price ?? 0).toFixed(2)} = ${lineTotal.toFixed(2)}
                              </p>
                              {(item.size || item.color) && (
                                <p className="text-slate-600 text-xs mt-0.5">
                                  {item.size && <span>Size: {item.size}</span>}
                                  {item.size && item.color && " · "}
                                  {item.color && <span>Color: {item.color}</span>}
                                </p>
                              )}
                              {item.productDescription && (
                                <p className="text-slate-400 text-xs mt-1 line-clamp-2">{item.productDescription}</p>
                              )}
                            </div>
                            <p className="font-bold text-[#BF0637] shrink-0">${lineTotal.toFixed(2)}</p>
                          </li>
                        );
                      })}
                    </ul>

                    <div className="grid sm:grid-cols-2 gap-4 pt-2">
                      <div className="bg-slate-50 rounded-xl p-4">
                        <p className="text-xs font-bold text-[#BF0637] uppercase tracking-wide mb-2">Shipping address</p>
                        <p className="text-sm text-slate-700">{formatAddress(ship)}</p>
                        {ship.phone && <p className="text-sm text-slate-600 mt-1">Phone: {String(ship.phone)}</p>}
                        {ship.email && <p className="text-sm text-slate-600">Email: {String(ship.email)}</p>}
                      </div>
                      <div className="bg-slate-50 rounded-xl p-4">
                        <p className="text-xs font-bold text-[#BF0637] uppercase tracking-wide mb-2">Billing address</p>
                        <p className="text-sm text-slate-700">
                          {order.billing_same_as_shipping ? "Same as shipping" : formatAddress(bill)}
                        </p>
                      </div>
                    </div>

                    <div className="border-t border-slate-200 pt-4 space-y-2">
                      <div className="flex justify-between text-sm text-slate-600">
                        <span>Subtotal</span>
                        <span>${subtotal.toFixed(2)}</span>
                      </div>
                      {shippingAmount > 0 && (
                        <div className="flex justify-between text-sm text-slate-600">
                          <span>Shipping</span>
                          <span>${shippingAmount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-lg font-bold text-slate-900 pt-2">
                        <span>Total</span>
                        <span className="text-[#BF0637]">${(order.amount_total ?? 0).toFixed(2)} {order.currency?.toUpperCase() ?? "USD"}</span>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </AuthPageWrapper>
  );
}
