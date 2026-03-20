"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Footer from "@/components/Footer";
import { useMerchCart } from "@/context/MerchCartContext";

type SessionState =
  | { phase: "loading" }
  | { phase: "error"; message: string }
  | {
      phase: "confirmed";
      email?: string | null;
      amount_total: number;
      currency: string;
      printify_order_id?: string;
      printify_external_id?: string;
      printify_error?: string;
      printify_pending: boolean;
    };

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function MerchCheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id")?.trim() ?? "";
  const { clearCart } = useMerchCart();
  const clearedRef = useRef(false);
  const [state, setState] = useState<SessionState>({ phase: "loading" });

  useEffect(() => {
    if (!sessionId) {
      setState({ phase: "error", message: "Missing checkout session. Return to merch and try again." });
      return;
    }
    let cancelled = false;
    const maxAttempts = 45;

    (async () => {
      for (let i = 0; i < maxAttempts && !cancelled; i++) {
        try {
          const res = await fetch(
            `/api/merch/checkout/session?session_id=${encodeURIComponent(sessionId)}`
          );
          const data = (await res.json()) as {
            paid?: boolean;
            error?: string;
            customer_email?: string;
            amount_total?: number;
            currency?: string;
            printify_order_id?: string;
            printify_external_id?: string;
            printify_error?: string;
            printify_pending?: boolean;
          };

          if (res.ok && data.paid === true) {
            if (!clearedRef.current) {
              clearedRef.current = true;
              clearCart();
            }
            if (!cancelled) {
              setState({
                phase: "confirmed",
                email: data.customer_email,
                amount_total: data.amount_total ?? 0,
                currency: data.currency ?? "usd",
                printify_order_id: data.printify_order_id,
                printify_external_id: data.printify_external_id,
                printify_error: data.printify_error,
                printify_pending: Boolean(data.printify_pending),
              });
            }
            return;
          }

          if (res.status === 402 || data.paid === false) {
            await sleep(2000);
            continue;
          }

          if (!cancelled) {
            setState({
              phase: "error",
              message: data.error ?? "Could not verify your order.",
            });
          }
          return;
        } catch {
          await sleep(2000);
        }
      }
      if (!cancelled) {
        setState({
          phase: "error",
          message:
            "Payment is not confirmed yet. If you paid, wait and refresh. Otherwise return to checkout.",
        });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [sessionId, clearCart]);

  const pollPrintify =
    state.phase === "confirmed" &&
    state.printify_pending &&
    !state.printify_order_id &&
    !state.printify_error;

  /** Refresh Printify status while user stays on page */
  useEffect(() => {
    if (!pollPrintify || !sessionId) return;
    const id = setInterval(async () => {
      try {
        const res = await fetch(
          `/api/merch/checkout/session?session_id=${encodeURIComponent(sessionId)}`
        );
        const data = (await res.json()) as {
          paid?: boolean;
          printify_order_id?: string;
          printify_external_id?: string;
          printify_error?: string;
          printify_pending?: boolean;
        };
        if (res.ok && data.paid) {
          setState((s) =>
            s.phase === "confirmed"
              ? {
                  ...s,
                  printify_order_id: data.printify_order_id ?? s.printify_order_id,
                  printify_external_id: data.printify_external_id ?? s.printify_external_id,
                  printify_error: data.printify_error ?? s.printify_error,
                  printify_pending: Boolean(data.printify_pending),
                }
              : s
          );
        }
      } catch {
        /* ignore */
      }
    }, 3000);
    return () => clearInterval(id);
  }, [pollPrintify, sessionId]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#fdfbf7] to-white">
      <div className="flex-1 pt-28 pb-16 px-4 flex items-center justify-center">
        {state.phase === "loading" && (
          <div className="max-w-md w-full text-center rounded-3xl border border-stone-200/80 bg-white p-10 shadow-[0_20px_60px_-24px_rgba(15,23,42,0.12)]">
            <div className="mx-auto w-12 h-12 border-2 border-[#BF0637]/30 border-t-[#BF0637] rounded-full animate-spin mb-6" />
            <h1 className="text-xl font-bold text-slate-900">Confirming your payment…</h1>
            <p className="mt-3 text-slate-600 text-sm leading-relaxed">
              Please wait while we verify your payment with Stripe. Do not close this page.
            </p>
          </div>
        )}

        {state.phase === "error" && (
          <div className="max-w-md w-full text-center rounded-3xl border border-red-100 bg-white p-10 shadow-lg">
            <h1 className="text-xl font-bold text-slate-900">Couldn&apos;t confirm order</h1>
            <p className="mt-3 text-slate-600 text-sm">{state.message}</p>
            <Link
              href="/merch/checkout"
              className="mt-8 inline-flex items-center justify-center w-full py-3.5 rounded-2xl font-bold text-white bg-[#BF0637] hover:bg-[#a0052e] transition-colors"
            >
              Back to checkout
            </Link>
            <Link href="/merch" className="mt-3 block text-sm text-slate-500 hover:text-[#BF0637]">
              Continue shopping
            </Link>
          </div>
        )}

        {state.phase === "confirmed" && (
          <div className="max-w-md w-full text-center rounded-3xl border border-stone-200/80 bg-white p-10 shadow-[0_20px_60px_-24px_rgba(15,23,42,0.12)]">
            <div className="mx-auto w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Payment received</h1>
            <p className="mt-3 text-slate-600 leading-relaxed">
              Thank you! Your order is confirmed.
              {state.email ? (
                <>
                  {" "}
                  We&apos;ll email <span className="font-medium text-slate-800">{state.email}</span> when it ships.
                </>
              ) : (
                " We'll email you when it ships."
              )}
            </p>
            <p className="mt-4 text-lg font-bold text-slate-900 tabular-nums">
              {state.currency.toUpperCase()} ${state.amount_total.toFixed(2)}
            </p>
            {state.printify_order_id && (
              <p className="mt-4 text-sm text-slate-500">
                Order ref:{" "}
                <span className="font-mono text-slate-700 bg-stone-50 rounded-lg py-1 px-2">
                  {state.printify_order_id}
                </span>
              </p>
            )}
            {state.printify_external_id && !state.printify_order_id && (
              <p className="mt-2 text-xs font-mono text-slate-400">{state.printify_external_id}</p>
            )}
            {state.printify_pending && !state.printify_error && (
              <p className="mt-4 text-sm text-amber-800 bg-amber-50 rounded-xl px-3 py-2">
                Sending your order to our print partner… this usually takes a few seconds. You can refresh this page.
              </p>
            )}
            {state.printify_error && (
              <p className="mt-4 text-sm text-amber-900 bg-amber-50 rounded-xl px-3 py-2 text-left">
                Your payment succeeded. Fulfillment is processing — if this message persists, contact support with your
                email. ({state.printify_error})
              </p>
            )}
            <Link
              href="/merch"
              className="mt-8 inline-flex items-center justify-center w-full py-3.5 rounded-2xl font-bold text-white bg-[#BF0637] hover:bg-[#a0052e] transition-colors shadow-lg shadow-[#BF0637]/20"
            >
              Continue shopping
            </Link>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default function MerchCheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#fdfbf7] to-white">
          <div className="flex-1 pt-28 flex items-center justify-center">
            <div className="w-12 h-12 border-2 border-[#BF0637]/30 border-t-[#BF0637] rounded-full animate-spin" />
          </div>
          <Footer />
        </div>
      }
    >
      <MerchCheckoutSuccessContent />
    </Suspense>
  );
}
