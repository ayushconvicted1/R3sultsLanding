"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";
import PasswordInput from "@/components/auth/PasswordInput";

const CHECKOUT_GUEST_FLAG = "r3sults_checkout_guest";

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

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Secure Checkout</h1>
          <p className="text-slate-600 mt-1">
            Sign in for faster checkout and order tracking, or continue as guest.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <section className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Sign In</h2>
            <p className="text-sm text-slate-600 mb-5">
              Use your account to continue checkout.
            </p>

            <div className="mb-4">
              <GoogleSignInButton className="w-full" onSuccessRedirect={nextPath} />
            </div>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-3 text-xs text-slate-400 uppercase tracking-wider">or</span>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#BF0637]/30 focus:border-[#BF0637]"
                required
              />
              <PasswordInput
                id="checkout-access-password"
                value={password}
                onChange={setPassword}
                placeholder="Password"
                required
                minLength={6}
              />
              {error && <p className="text-sm text-red-600">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg font-semibold text-white bg-black hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>
            <Link href="/forgot-password" className="block mt-4 text-sm text-slate-600 hover:text-[#BF0637]">
              Forgot your password?
            </Link>
          </section>

          <section className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 flex flex-col">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">No account yet?</h2>
            <p className="text-sm text-slate-600 mb-6">
              Checkout as guest. You can create an account later.
            </p>
            <button
              type="button"
              onClick={handleGuestCheckout}
              className="w-full py-3 rounded-lg border-2 border-slate-900 text-slate-900 font-semibold hover:bg-slate-50 transition-colors"
            >
              Checkout as Guest
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}

