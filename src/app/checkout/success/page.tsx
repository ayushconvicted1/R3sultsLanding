"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/context/CartContext";
import type { ShippingAddress } from "@/types/checkout";
import Footer from "@/components/Footer";

interface LineItemSummary {
  name: string;
  quantity: number;
  price: number;
  image?: string;
  size?: string;
  color?: string;
}

interface OrderSummary {
  lineItemsFull?: LineItemSummary[];
  shippingAddress?: ShippingAddress;
  shippingAmount?: number;
}

interface SessionData {
  id: string;
  payment_status: string;
  customer_email: string | null;
  metadata: Record<string, string> | null;
  amount_total: number | null;
  orderSummary?: OrderSummary;
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
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full border-4 border-[#BF0637]/30 border-t-[#BF0637] animate-spin" />
            <p className="text-slate-600 font-medium text-sm">Loading your order…</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-8 max-w-md text-center">
          <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mb-2">Unable to load order</h1>
          <p className="text-slate-600 mb-6 text-sm">{error || "Invalid or expired session."}</p>
          <Link
            href="/shop"
            className="inline-block px-6 py-3 rounded-xl font-semibold text-white text-sm"
            style={{ backgroundColor: "#BF0637" }}
          >
            Back to shop
          </Link>
        </div>
        </div>
        <Footer />
      </div>
    );
  }

  const summary = session.orderSummary;
  const shipping = summary?.shippingAddress;
  const shippingAmount = summary?.shippingAmount ?? 0;
  const amountTotalCents = session.amount_total ?? 0;
  const amountTotal = amountTotalCents / 100;
  const subtotal = amountTotal - shippingAmount;
  const items = summary?.lineItemsFull ?? [];
  const fallbackItems = session.line_items ?? [];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col mt-16
    ">
      <div className="flex-1 flex flex-col items-center justify-center py-4 px-3 sm:py-6 sm:px-4">
        <div className="max-w-xl mx-auto w-full">
        {/* Compact success card - all in one view */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
          {/* Header */}
          <div className="px-4 py-5 sm:px-5 sm:py-6 text-center bg-gradient-to-b from-[#BF0637]/10 to-white border-b border-slate-100">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-100 text-green-600 mb-3">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">Thank you for your order</h1>
            <p className="text-slate-600 text-sm">
              Confirmation sent to <strong className="text-slate-800">{session.customer_email || "your email"}</strong>
            </p>
          </div>

          {/* Order details - compact */}
          <div className="px-4 py-4 sm:px-5 sm:py-4 space-y-4">
            {/* Items - compact list */}
            <div>
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Items</h3>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {items.length > 0
                  ? items.map((item, idx) => (
                      <div key={idx} className="flex gap-3 py-2 border-b border-slate-100 last:border-0">
                        {item.image && (
                          <div className="relative w-12 h-12 shrink-0 rounded-lg overflow-hidden bg-slate-100">
                            <Image src={item.image} alt={item.name} fill className="object-cover" unoptimized />
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-slate-800 truncate">{item.name}</p>
                          <p className="text-xs text-slate-500">
                            {item.quantity} × ${item.price.toFixed(2)}
                            {(item.size || item.color) && ` · ${[item.size, item.color].filter(Boolean).join(" ")}`}
                          </p>
                        </div>
                        <p className="text-sm font-semibold text-slate-800 shrink-0">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))
                  : fallbackItems.map((li, idx) => (
                      <div key={idx} className="flex justify-between py-1.5 border-b border-slate-100 last:border-0 text-sm">
                        <span className="text-slate-700 truncate flex-1">{li.description ?? "Item"}</span>
                        <span className="text-slate-800 font-medium shrink-0 ml-2">
                          {li.quantity ?? 0} × ${((li.amount_total ?? 0) / 100).toFixed(2)}
                        </span>
                      </div>
                    ))}
              </div>
            </div>

            {/* Totals - always visible */}
            <div className="bg-slate-50 rounded-xl p-3 space-y-1.5 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Shipping</span>
                <span>${shippingAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-slate-900 pt-2 border-t border-slate-200">
                <span>Total paid</span>
                <span className="text-[#BF0637]">${amountTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Shipping address - compact */}
            {shipping && (
              <div className="bg-slate-50 rounded-xl p-3">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Shipping address</h3>
                <p className="text-sm text-slate-700">
                  {[shipping.firstName, shipping.lastName].filter(Boolean).join(" ")}
                  {shipping.line1 && ` · ${shipping.line1}`}
                  {shipping.city && `, ${shipping.city}`}
                  {shipping.state && ` ${shipping.state}`}
                  {shipping.postalCode && ` ${shipping.postalCode}`}
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="px-4 py-4 sm:px-5 bg-slate-50 border-t border-slate-200 flex flex-wrap gap-2 justify-center">
            <Link
              href="/shop"
              className="px-5 py-2.5 rounded-xl font-semibold text-white text-sm"
              style={{ backgroundColor: "#BF0637" }}
            >
              Continue shopping
            </Link>
            <Link
              href="/"
              className="px-5 py-2.5 rounded-xl font-semibold text-slate-700 bg-white border border-slate-300 text-sm hover:bg-slate-50"
            >
              Home
            </Link>
          </div>
        </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex flex-col">
          <div className="flex-1 flex flex-col items-center justify-center p-6">
            <div className="w-12 h-12 rounded-full border-4 border-[#BF0637]/30 border-t-[#BF0637] animate-spin" />
            <p className="mt-4 text-slate-500 text-sm">Loading…</p>
          </div>
          <Footer />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
