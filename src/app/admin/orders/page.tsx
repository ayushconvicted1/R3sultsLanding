"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const ADMIN_KEY_STORAGE = "admin_orders_key";

interface Order {
  id: string;
  stripe_session_id: string;
  customer_email: string;
  amount_total?: number; // dollars (e.g. 250.00)
  amount_total_cents?: number; // legacy
  amount_subtotal?: number;
  shipping_amount?: number;
  currency: string;
  payment_status: string;
  shipping_address?: Record<string, unknown>;
  billing_address?: Record<string, string>;
  billing_same_as_shipping?: boolean;
  line_items?: Array<{ name?: string; quantity?: number; amount_total?: number }>;
  created_at: string;
}

function OrdersContent() {
  const searchParams = useSearchParams();
  const [key, setKeyState] = useState<string>("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [keyInput, setKeyInput] = useState("");

  useEffect(() => {
    const fromUrl = searchParams.get("key");
    const fromStorage = typeof window !== "undefined" ? localStorage.getItem(ADMIN_KEY_STORAGE) : null;
    setKeyState(fromUrl || fromStorage || "");
  }, [searchParams]);

  const fetchOrders = async (authKey: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/orders?key=${encodeURIComponent(authKey)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load orders");
      setOrders(data.orders ?? []);
      if (typeof window !== "undefined") localStorage.setItem(ADMIN_KEY_STORAGE, authKey);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (key) fetchOrders(key);
  }, [key]);

  const handleSubmitKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyInput.trim()) {
      setKeyState(keyInput.trim());
      fetchOrders(keyInput.trim());
    }
  };

  const handleLogout = () => {
    setKeyState("");
    setKeyInput("");
    setOrders([]);
    if (typeof window !== "undefined") localStorage.removeItem(ADMIN_KEY_STORAGE);
  };

  if (!key) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8 max-w-md w-full">
          <h1 className="text-xl font-bold text-slate-900 mb-2">Admin — Orders</h1>
          <p className="text-slate-600 text-sm mb-6">Enter your admin key to view orders.</p>
          <form onSubmit={handleSubmitKey} className="space-y-4">
            <input
              type="password"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              placeholder="Admin key"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#BF0637]/50 focus:border-[#BF0637]"
              autoComplete="off"
            />
            <button
              type="submit"
              className="w-full py-2.5 rounded-lg font-semibold text-white"
              style={{ backgroundColor: "#BF0637" }}
            >
              View orders
            </button>
          </form>
          <Link href="/" className="block mt-4 text-center text-slate-500 hover:text-[#BF0637] text-sm">
            Back to site
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Orders</h1>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => fetchOrders(key)}
              disabled={loading}
              className="px-4 py-2 rounded-lg font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 disabled:opacity-50"
            >
              {loading ? "Loading…" : "Refresh"}
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg font-medium text-slate-600 hover:text-slate-800"
            >
              Log out
            </button>
            <Link href="/" className="text-slate-500 hover:text-[#BF0637] text-sm">
              Back to site
            </Link>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {orders.length === 0 && !loading ? (
            <div className="p-12 text-center text-slate-500">No orders yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80">
                    <th className="px-4 py-3 font-semibold text-slate-700">Order ID</th>
                    <th className="px-4 py-3 font-semibold text-slate-700">Stripe Session</th>
                    <th className="px-4 py-3 font-semibold text-slate-700">Email</th>
                    <th className="px-4 py-3 font-semibold text-slate-700">Total</th>
                    <th className="px-4 py-3 font-semibold text-slate-700">Status</th>
                    <th className="px-4 py-3 font-semibold text-slate-700">Date</th>
                    <th className="px-4 py-3 font-semibold text-slate-700">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => {
                    const shipping = (order.shipping_address ?? {}) as Record<string, string>;
                    const items = order.line_items ?? [];
                    return (
                      <tr key={order.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                        <td className="px-4 py-3 font-mono text-sm text-slate-800">{order.id}</td>
                        <td className="px-4 py-3 font-mono text-xs text-slate-600 max-w-[140px] truncate" title={order.stripe_session_id}>
                          {order.stripe_session_id}
                        </td>
                        <td className="px-4 py-3 text-slate-700">{order.customer_email}</td>
                        <td className="px-4 py-3 text-slate-800 font-medium">
                          ${(order.amount_total != null ? order.amount_total : (order.amount_total_cents ?? 0) / 100).toFixed(2)} {order.currency.toUpperCase()}
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                            {order.payment_status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-600 text-sm">
                          {order.created_at ? new Date(order.created_at).toLocaleString() : "—"}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <details className="cursor-pointer">
                            <summary className="text-[#BF0637] hover:underline">Shipping & items</summary>
                            <div className="mt-2 p-3 bg-slate-50 rounded text-xs space-y-2 max-w-md">
                              {(shipping.firstName != null && shipping.lastName != null
                                ? `${shipping.firstName} ${shipping.lastName}`
                                : shipping.fullName) && (
                                <p><strong>Name:</strong> {shipping.firstName != null && shipping.lastName != null ? `${shipping.firstName} ${shipping.lastName}` : shipping.fullName}</p>
                              )}
                              {shipping.phone && <p><strong>Phone:</strong> {shipping.phone}</p>}
                              {shipping.line1 && <p><strong>Address:</strong> {shipping.line1}, {shipping.city}, {shipping.state} {shipping.postalCode}</p>}
                              {order.shipping_amount != null && (
                                <p><strong>Shipping:</strong> ${order.shipping_amount.toFixed(2)}</p>
                              )}
                              {order.billing_same_as_shipping === false && order.billing_address && (
                                <p><strong>Billing:</strong> {order.billing_address.line1}, {order.billing_address.city}</p>
                              )}
                              <p><strong>Items:</strong> {items.map((i) => `${i.name ?? "Item"} × ${i.quantity ?? 0}`).join("; ") || "—"}</p>
                            </div>
                          </details>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AdminOrdersFallback() {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center">
      <p className="text-slate-500">Loading…</p>
    </div>
  );
}

export default function AdminOrdersPage() {
  return (
    <Suspense fallback={<AdminOrdersFallback />}>
      <div className="min-h-screen">
        <OrdersContent />
      </div>
    </Suspense>
  );
}
