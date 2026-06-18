"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { useAuth } from "@/context/AuthContext";
import AuthPageWrapper from "@/components/auth/AuthPageWrapper";
import PasswordInput from "@/components/auth/PasswordInput";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";

const inputClass =
  "w-full px-4 py-3 border border-slate-300 rounded-lg bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#BF0637]/40 focus:border-[#BF0637] transition-colors";
const labelClass = "block text-sm font-medium text-slate-700 mb-1.5";
const btnPrimary =
  "w-full py-3 rounded-lg font-semibold text-white bg-[#BF0637] hover:bg-[#a0052e] focus:outline-none focus:ring-2 focus:ring-[#BF0637]/50 focus:ring-offset-2 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm hover:shadow-md";

const phoneInputWrapper =
  "[&_.PhoneInput]:flex [&_.PhoneInput]:gap-2 [&_.PhoneInputInput]:flex-1 [&_.PhoneInputInput]:px-4 [&_.PhoneInputInput]:py-3 [&_.PhoneInputInput]:border [&_.PhoneInputInput]:border-slate-300 [&_.PhoneInputInput]:rounded-lg [&_.PhoneInputInput]:bg-white [&_.PhoneInputInput]:text-slate-900 [&_.PhoneInputInput]:focus:outline-none [&_.PhoneInputInput]:focus:ring-2 [&_.PhoneInputInput]:focus:ring-[#BF0637]/40 [&_.PhoneInputInput]:focus:border-[#BF0637]";

type LoginMode = "password" | "otp";

export default function LoginPage() {
  const router = useRouter();
  const { loginWithPassword, sendOtp, verifyOtp, user } = useAuth();
  const [mode, setMode] = useState<LoginMode>("password");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) router.replace("/dashboard");
  }, [user, router]);

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const trimmedEmail = (email || "").trim().toLowerCase();
    if (!trimmedEmail) {
      setError("Please enter your email address");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError("Please enter a valid email address");
      return;
    }
    if (!password) {
      setError("Please enter your password");
      return;
    }
    setLoading(true);
    const { error: err } = await loginWithPassword(trimmedEmail, password);
    setLoading(false);
    if (err) {
      toast.error(err);
      setError(err);
      return;
    }
    toast.success("Welcome back!");
    router.push("/dashboard");
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const trimmed = (phoneNumber || "").toString().trim();
    if (!trimmed) {
      setError("Please enter your phone number");
      return;
    }
    setLoading(true);
    const { error: err } = await sendOtp(trimmed);
    setLoading(false);
    if (err) {
      toast.error(err);
      setError(err);
      return;
    }
    toast.success("OTP sent! Check your phone.");
    setStep("otp");
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!otp.trim()) {
      setError("Please enter the OTP");
      return;
    }
    setLoading(true);
    const { error: err } = await verifyOtp((phoneNumber || "").toString().trim(), otp.trim());
    setLoading(false);
    if (err) {
      toast.error(err);
      setError(err);
      return;
    }
    toast.success("Welcome! Redirecting…");
    router.push("/dashboard");
  };

  const switchMode = (m: LoginMode) => {
    setMode(m);
    setStep("phone");
    setOtp("");
    setPassword("");
    setError(null);
  };

  if (user) return null;

  const phoneValue = phoneNumber || undefined;

  return (
    <AuthPageWrapper>
      <div className="w-full max-w-[420px] mx-auto">
        {/* Card */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/80 overflow-hidden">
          {/* Header strip */}
          <div className="h-1.5 bg-gradient-to-r from-[#BF0637] to-[#d40842]" aria-hidden />

          <div className="p-8 sm:p-10">
            {/* Logo / Title */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Sign in
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                Sign in to your account to continue
              </p>
            </div>

            {/* Google Sign-In */}
            <div className="mb-6">
              <GoogleSignInButton className="w-full" onSuccessRedirect="/dashboard" />
            </div>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-3 text-xs font-medium text-slate-400 uppercase tracking-wider">
                  or continue with email
                </span>
              </div>
            </div>

            {/* Password / OTP toggle */}
            <div className="flex rounded-lg bg-slate-100 p-1 mb-6">
              <button
                type="button"
                onClick={() => switchMode("password")}
                className={`flex-1 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  mode === "password"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Email & password
              </button>
              <button
                type="button"
                onClick={() => switchMode("otp")}
                className={`flex-1 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  mode === "otp"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                One-time code
              </button>
            </div>

            {/* Form: Email + Password login */}
            {mode === "password" && step === "phone" && (
              <form onSubmit={handlePasswordLogin} className="space-y-5">
                <div>
                  <label htmlFor="login-email" className={labelClass}>
                    Email address
                  </label>
                  <input
                    id="login-email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label htmlFor="login-password" className={labelClass}>
                      Password
                    </label>
                    <Link
                      href="/forgot-password"
                      className="text-sm font-medium text-[#BF0637] hover:text-[#a0052e] hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <PasswordInput
                    id="login-password"
                    value={password}
                    onChange={setPassword}
                    placeholder="Enter your password"
                    required
                    minLength={6}
                  />
                </div>
                {error && (
                  <p className="text-sm text-red-600 font-medium" role="alert">
                    {error}
                  </p>
                )}
                <button type="submit" disabled={loading} className={btnPrimary}>
                  {loading ? "Signing in…" : "Sign in"}
                </button>
              </form>
            )}

            {/* Form: OTP – request code */}
            {mode === "otp" && step === "phone" && (
              <form onSubmit={handleSendOtp} className="space-y-5">
                <div>
                  <label htmlFor="otp-phone" className={labelClass}>
                    Phone number
                  </label>
                  <div className={phoneInputWrapper}>
                    <PhoneInput
                      international
                      defaultCountry="US"
                      value={phoneValue}
                      onChange={(v) => setPhoneNumber(v ?? "")}
                      numberInputProps={{
                        id: "otp-phone",
                        className: "!rounded-lg",
                        required: true,
                        placeholder: "Enter phone number",
                      }}
                      placeholder="Enter phone number"
                    />
                  </div>
                  <p className="mt-1.5 text-xs text-slate-500">
                    We&apos;ll send a one-time code to this number
                  </p>
                </div>
                {error && (
                  <p className="text-sm text-red-600 font-medium" role="alert">
                    {error}
                  </p>
                )}
                <button type="submit" disabled={loading} className={btnPrimary}>
                  {loading ? "Sending code…" : "Send code"}
                </button>
              </form>
            )}

            {/* Form: OTP – verify */}
            {mode === "otp" && step === "otp" && (
              <form onSubmit={handleVerifyOtp} className="space-y-5">
                <p className="text-sm text-slate-600">
                  Enter the 6-digit code sent to{" "}
                  <strong className="text-slate-900">{phoneNumber}</strong>
                </p>
                <div>
                  <label htmlFor="otp-code" className={labelClass}>
                    Verification code
                  </label>
                  <input
                    id="otp-code"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    className={inputClass}
                    placeholder="000000"
                  />
                </div>
                {error && (
                  <p className="text-sm text-red-600 font-medium" role="alert">
                    {error}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={loading || otp.length < 4}
                  className={btnPrimary}
                >
                  {loading ? "Verifying…" : "Verify and sign in"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStep("phone");
                    setOtp("");
                    setError(null);
                  }}
                  className="w-full py-2 text-sm font-medium text-slate-600 hover:text-slate-900"
                >
                  Use a different number
                </button>
              </form>
            )}
          </div>

          {/* Footer */}
          <div className="px-8 sm:px-10 py-5 bg-slate-50/80 border-t border-slate-200 text-center">
            <p className="text-sm text-slate-600">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-semibold text-[#BF0637] hover:text-[#a0052e] hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </AuthPageWrapper>
  );
}
