"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import AuthPageWrapper from "@/components/auth/AuthPageWrapper";

const inputClass =
  "w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-[#BF0637]/30 focus:border-[#BF0637] transition-colors";
const labelClass = "block text-sm font-semibold text-slate-700 mb-1.5";
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError(null);
    if (!email.trim()) {
      setEmailError("Email is required");
      return;
    }
    if (!EMAIL_REGEX.test(email)) {
      setEmailError("Enter a valid email address");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Something went wrong");
        return;
      }
      setSent(true);
      toast.success("If an account exists, you will receive a reset link.");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <AuthPageWrapper>
        <div className="max-w-md mx-auto">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-slate-200/80 shadow-2xl p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Check your email</h1>
            <p className="text-slate-600 mb-6">
              If an account exists for <strong>{email}</strong>, you will receive a link to reset your password.
            </p>
            <Link
              href="/login"
              className="inline-block px-6 py-3 rounded-xl font-semibold text-white"
              style={{ backgroundColor: "#BF0637" }}
            >
              Back to login
            </Link>
          </div>
        </div>
      </AuthPageWrapper>
    );
  }

  return (
    <AuthPageWrapper>
      <div className="max-w-md mx-auto">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-slate-200/80 shadow-2xl p-5 sm:p-6">
          <h1 className="text-2xl font-bold text-slate-900 mb-0.5">Forgot password</h1>
          <p className="text-slate-600 mb-4 text-sm">Enter your email and we&apos;ll send you a link to reset your password.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className={labelClass}>Email</label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => { setEmail(e.target.value); setEmailError(null); }}
                className={`${inputClass} ${emailError ? "border-red-300" : ""}`}
                placeholder="you@example.com"
                aria-invalid={!!emailError}
              />
              {emailError && <p className="mt-1.5 text-sm text-red-600 font-medium" role="alert">{emailError}</p>}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-bold text-white shadow-lg shadow-[#BF0637]/25 hover:shadow-[#BF0637]/40 transition-all disabled:opacity-70"
              style={{ backgroundColor: "#BF0637" }}
            >
              {loading ? "Sending…" : "Send reset link"}
            </button>
            <p className="text-center">
              <Link href="/login" className="text-sm font-semibold text-[#BF0637] hover:underline">Back to login</Link>
            </p>
          </form>
        </div>
      </div>
    </AuthPageWrapper>
  );
}
