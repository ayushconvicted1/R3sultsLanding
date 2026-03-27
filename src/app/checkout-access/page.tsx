"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";
import PasswordInput from "@/components/auth/PasswordInput";

const CHECKOUT_GUEST_FLAG = "r3sults_checkout_guest";

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 2.5l7 3v6c0 4.5-3.2 8.7-7 9.5-3.8-.8-7-5-7-9.5V5.5l7-3z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M9 12.2l2 2 4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 11a3.5 3.5 0 100-7 3.5 3.5 0 000 7zM4 20.5v-.5A7 7 0 0119 20"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 6h15l-2 9H8L6 6zm0 0L5 3H2M9 20a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function CheckoutAccessPage() {
  const router = useRouter();
  const { user, loading: authLoading, loginWithPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [nextPath, setNextPath] = useState("/checkout");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const n = new URLSearchParams(window.location.search).get("next");
    if (n && n.startsWith("/")) setNextPath(n);
  }, []);

  useEffect(() => {
    if (!authLoading && user) {
      router.replace(nextPath);
    }
  }, [authLoading, user, router, nextPath]);

  const handleGuestCheckout = () => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(CHECKOUT_GUEST_FLAG, "1");
    }
    router.push(nextPath);
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !password.trim()) {
      setError("Enter email and password.");
      return;
    }
    setLoading(true);
    const result = await loginWithPassword(trimmedEmail, password);
    setLoading(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(CHECKOUT_GUEST_FLAG);
    }
    router.push(nextPath);
  };

  const isMerch = nextPath.startsWith("/merch");

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-[#BF0637]/10 blur-3xl" />
        <div className="absolute top-1/3 -left-20 h-64 w-64 rounded-full bg-sky-200/40 blur-3xl" />
      </div>

      <div className="relative z-10 pt-24 sm:pt-28 pb-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center sm:text-left mb-10 sm:mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-medium text-slate-600 shadow-sm mb-4">
              <ShieldIcon className="h-4 w-4 text-emerald-600" />
              Secure checkout
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
              Continue to checkout
            </h1>
            <p className="mt-3 text-slate-600 text-base sm:text-lg max-w-2xl mx-auto sm:mx-0">
              Sign in for saved addresses and order history, or continue as a guest.
              Your payment step is encrypted either way.
            </p>
            {isMerch ? (
              <p className="mt-2 text-sm text-slate-500">
                You are checking out{" "}
                <span className="text-[#BF0637] font-semibold">merchandise</span>.
              </p>
            ) : null}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            <section className="relative rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-lg shadow-slate-200/50">
              <div className="absolute top-0 right-0 h-28 w-28 rounded-bl-full bg-[#BF0637]/5 pointer-events-none" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#BF0637]/10 text-[#BF0637]">
                    <UserIcon className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                    Sign in
                  </h2>
                </div>
                <p className="text-sm text-slate-600 mb-6">
                  Use your R3sults account for a faster checkout.
                </p>

                <div className="mb-5">
                  <GoogleSignInButton
                    className="w-full rounded-xl"
                    onSuccessRedirect={nextPath}
                  />
                </div>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-white px-4 text-xs font-medium uppercase tracking-wider text-slate-400">
                      or email
                    </span>
                  </div>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label
                      htmlFor="checkout-access-email"
                      className="block text-xs font-medium text-slate-600 mb-1.5"
                    >
                      Email
                    </label>
                    <input
                      id="checkout-access-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#BF0637] focus:ring-2 focus:ring-[#BF0637]/20"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="checkout-access-password"
                      className="block text-xs font-medium text-slate-600 mb-1.5"
                    >
                      Password
                    </label>
                    <PasswordInput
                      id="checkout-access-password"
                      value={password}
                      onChange={setPassword}
                      placeholder="••••••••"
                      required
                      minLength={6}
                    />
                  </div>
                  {error ? (
                    <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                      {error}
                    </p>
                  ) : null}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-xl font-semibold text-white bg-linear-to-r from-[#BF0637] to-[#9d0530] hover:opacity-95 transition-opacity disabled:opacity-50 shadow-md shadow-[#BF0637]/25"
                  >
                    {loading ? "Signing in…" : "Sign in & continue"}
                  </button>
                </form>
                <Link
                  href="/forgot-password"
                  className="inline-block mt-4 text-sm text-slate-600 hover:text-[#BF0637] transition-colors"
                >
                  Forgot your password?
                </Link>
              </div>
            </section>

            <section className="relative rounded-2xl border border-emerald-200/80 bg-linear-to-br from-emerald-50/90 to-white p-6 sm:p-8 shadow-lg shadow-slate-200/40 flex flex-col">
              <div className="absolute bottom-0 left-0 h-32 w-32 rounded-tr-full bg-emerald-100/50 pointer-events-none" />
              <div className="relative flex-1 flex flex-col">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                    <CartIcon className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                    Guest checkout
                  </h2>
                </div>
                <p className="text-sm text-slate-600 mb-6">
                  No account needed. Complete your order and track confirmation by
                  email.
                </p>

                <ul className="space-y-3 mb-8 flex-1 text-sm text-slate-700">
                  <li className="flex gap-2">
                    <span className="text-emerald-600 shrink-0 font-semibold">✓</span>
                    Same secure payment as signed-in checkout
                  </li>
                  <li className="flex gap-2">
                    <span className="text-emerald-600 shrink-0 font-semibold">✓</span>
                    Order updates sent to your email
                  </li>
                  <li className="flex gap-2">
                    <span className="text-emerald-600 shrink-0 font-semibold">✓</span>
                    Create an account anytime after purchase
                  </li>
                </ul>

                <button
                  type="button"
                  onClick={handleGuestCheckout}
                  className="w-full py-3.5 rounded-xl border-2 border-slate-800 bg-white text-slate-900 font-semibold hover:bg-slate-50 transition-colors shadow-sm"
                >
                  Continue as guest
                </button>
              </div>
            </section>
          </div>

          <p className="mt-10 text-center text-xs text-slate-500 max-w-xl mx-auto">
            We use industry-standard encryption for your payment details. By continuing
            you agree to our{" "}
            <Link
              href="/terms-and-condition"
              className="text-slate-600 underline hover:text-[#BF0637]"
            >
              Terms
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy-policy"
              className="text-slate-600 underline hover:text-[#BF0637]"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
