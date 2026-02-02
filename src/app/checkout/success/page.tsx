"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/context/CartContext";
import type { ShippingAddress } from "@/types/checkout";

interface SessionData {
  id: string;
  payment_status: string;
  customer_email: string | null;
  metadata: Record<string, string> | null;
  amount_total: number | null;
  line_items?: Array<{
    description: string | null;
    quantity: number | null;
    amount_total: number | null;
  }>;
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { clearCart } = useCart();
  const [session, setSession] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(!!sessionId);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setError("No session ID");
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/checkout/session?session_id=${encodeURIComponent(sessionId)}`);
        const data = await res.json();
        if (cancelled) return;
        if (!res.ok) {
          setError(data.error || "Failed to load order");
          return;
        }
        setSession(data.session);
        clearCart();
      } catch {
        if (!cancelled) setError("Failed to load order");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [sessionId, clearCart]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex flex-col items-center justify-center p-6">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-[#BF0637]/30 border-t-[#BF0637] animate-spin" />
          <p className="text-slate-600 font-medium">Loading your order…</p>
        </div>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex flex-col items-center justify-center p-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-8 max-w-md text-center">
          <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mb-2">Unable to load order</h1>
          <p className="text-slate-600 mb-6">{error || "Invalid or expired session."}</p>
          <Link
            href="/shop"
            className="inline-block px-6 py-3 rounded-xl font-semibold text-white shadow-lg shadow-[#BF0637]/25 transition hover:shadow-[#BF0637]/40"
            style={{ backgroundColor: "#BF0637" }}
          >
            Back to shop
          </Link>
        </div>
      </div>
    );
  }

  let shipping: ShippingAddress | null = null;
  if (session.metadata?.shippingAddress) {
    try {
      shipping = JSON.parse(session.metadata.shippingAddress) as ShippingAddress;
    } catch {
      // ignore
    }
  }

  const amountTotal = session.amount_total != null ? session.amount_total / 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Success header card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden mb-6">
          <div className="relative px-6 py-10 text-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#BF0637]/5 to-transparent" />
            <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 text-green-600 mb-5 ring-4 ring-green-100/80">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">Thank you for your order</h1>
            <p className="text-slate-600 text-base max-w-md mx-auto">
              Your payment was successful. A confirmation has been sent to{" "}
              <strong className="text-slate-800">{session.customer_email || "your email"}</strong>.
            </p>
          </div>
        </div>

        {/* Receipt card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/60">
            <h2 className="text-lg font-bold text-slate-900">Order details</h2>
            <p className="text-slate-500 text-sm font-mono mt-0.5">{session.id}</p>
          </div>

          <div className="p-6 space-y-6">
            {session.line_items && session.line_items.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Items</h3>
                <div className="rounded-xl border border-slate-200 overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="px-4 py-3 font-semibold text-slate-700">Item</th>
                        <th className="px-4 py-3 font-semibold text-slate-700 text-center">Qty</th>
                        <th className="px-4 py-3 font-semibold text-slate-700 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {session.line_items.map((li, idx) => (
                        <tr key={idx} className="border-b border-slate-100 last:border-0">
                          <td className="px-4 py-3 text-slate-800">{li.description ?? "Item"}</td>
                          <td className="px-4 py-3 text-center text-slate-600">{li.quantity ?? 0}</td>
                          <td className="px-4 py-3 text-right font-medium text-slate-800">
                            ${((li.amount_total ?? 0) / 100).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {shipping && (
              <div>
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Shipping address</h3>
                <div className="rounded-xl bg-slate-50/80 border border-slate-200 p-4 text-slate-700">
                  <p className="font-semibold text-slate-900">
                    {shipping.firstName != null && shipping.lastName != null
                      ? `${shipping.firstName} ${shipping.lastName}`
                      : (shipping as { fullName?: string }).fullName ?? "—"}
                  </p>
                  <p>{shipping.line1}</p>
                  {shipping.line2 && <p>{shipping.line2}</p>}
                  <p>
                    {shipping.city}, {shipping.state} {shipping.postalCode}
                  </p>
                  <p>{shipping.country}</p>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center pt-4 border-t-2 border-slate-200">
              <span className="text-lg font-semibold text-slate-800">Total paid</span>
              <span className="text-2xl font-bold text-[#BF0637]">${amountTotal.toFixed(2)}</span>
            </div>
          </div>

          <div className="px-6 py-5 bg-slate-50/80 border-t border-slate-200 flex flex-wrap gap-3 justify-center">
            <Link
              href="/shop"
              className="px-6 py-3 rounded-xl font-semibold text-white shadow-lg shadow-[#BF0637]/25 transition hover:shadow-[#BF0637]/40"
              style={{ backgroundColor: "#BF0637" }}
            >
              Continue shopping
            </Link>
            <Link
              href="/"
              className="px-6 py-3 rounded-xl font-semibold text-slate-700 bg-white border-2 border-slate-300 hover:bg-slate-50 hover:border-slate-400 transition"
            >
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex flex-col items-center justify-center p-6">
          <div className="w-12 h-12 rounded-full border-4 border-[#BF0637]/30 border-t-[#BF0637] animate-spin" />
          <p className="mt-4 text-slate-500">Loading your order…</p>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
