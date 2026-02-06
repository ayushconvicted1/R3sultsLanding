"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";
import AuthPageWrapper from "@/components/auth/AuthPageWrapper";
import PasswordInput from "@/components/auth/PasswordInput";

const inputClass =
  "w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-[#BF0637]/30 focus:border-[#BF0637] transition-colors";
const labelClass = "block text-sm font-semibold text-slate-700 mb-1";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage() {
  const router = useRouter();
  const { login, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) router.replace("/profile");
  }, [user, router]);

  const validate = () => {
    const next: { email?: string; password?: string } = {};
    if (!email.trim()) next.email = "Email is required";
    else if (!EMAIL_REGEX.test(email)) next.email = "Enter a valid email address";
    if (!password) next.password = "Password is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    const { error: err } = await login(email, password);
    setLoading(false);
    if (err) {
      toast.error(err);
      return;
    }
    toast.success("Welcome back! Redirecting…");
    router.push("/profile");
  };

  if (user) return null;

  return (
    <AuthPageWrapper>
      <div className="max-w-md mx-auto">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-slate-200/80 shadow-2xl p-5 sm:p-6">
          <h1 className="text-2xl font-bold text-slate-900 mb-0.5">Log in</h1>
          <p className="text-slate-600 mb-4 text-sm">Welcome back. Sign in to your account.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className={labelClass}>
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: undefined })); }}
                className={`${inputClass} ${errors.email ? "border-red-300" : ""}`}
                placeholder="you@example.com"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
              {errors.email && (
                <p id="email-error" className="mt-1.5 text-sm text-red-600 font-medium" role="alert">{errors.email}</p>
              )}
            </div>
            <div>
              <label htmlFor="password" className={labelClass}>
                Password
              </label>
              <PasswordInput
                id="password"
                value={password}
                onChange={setPassword}
                placeholder="••••••••"
                required
                error={errors.password}
                aria-describedby={errors.password ? "password-error" : undefined}
              />
            </div>
            <div className="flex justify-end">
              <Link href="/forgot-password" className="text-sm font-semibold text-[#BF0637] hover:underline">
                Forgot password?
              </Link>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-bold text-white shadow-lg shadow-[#BF0637]/25 hover:shadow-[#BF0637]/40 transition-all disabled:opacity-70"
              style={{ backgroundColor: "#BF0637" }}
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
            <p className="text-center text-slate-600 text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="font-semibold text-[#BF0637] hover:underline">
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </AuthPageWrapper>
  );
}
