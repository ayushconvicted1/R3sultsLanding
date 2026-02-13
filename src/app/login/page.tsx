"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { useAuth } from "@/context/AuthContext";
import AuthPageWrapper from "@/components/auth/AuthPageWrapper";

const inputClass =
  "w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-[#BF0637]/30 focus:border-[#BF0637] transition-colors";
const labelClass = "block text-sm font-semibold text-slate-700 mb-1";

export default function LoginPage() {
  const router = useRouter();
  const { sendOtp, verifyOtp, user } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) router.replace("/profile");
  }, [user, router]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const trimmed = phoneNumber.trim();
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
    const { error: err } = await verifyOtp(phoneNumber.trim(), otp.trim());
    setLoading(false);
    if (err) {
      toast.error(err);
      setError(err);
      return;
    }
    toast.success("Welcome! Redirecting…");
    router.push("/profile");
  };

  if (user) return null;

  return (
    <AuthPageWrapper>
      <div className="max-w-md mx-auto">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-slate-200/80 shadow-2xl p-5 sm:p-6">
          <h1 className="text-2xl font-bold text-slate-900 mb-0.5">Log in</h1>
          <p className="text-slate-600 mb-4 text-sm">
            Enter your phone number. We&apos;ll send you a one-time code to sign in.
          </p>

          {step === "phone" ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="[&_.PhoneInput]:flex [&_.PhoneInput]:gap-2 [&_.PhoneInputInput]:flex-1 [&_.PhoneInputInput]:border-2 [&_.PhoneInputInput]:border-slate-200 [&_.PhoneInputInput]:rounded-xl [&_.PhoneInputInput]:px-4 [&_.PhoneInputInput]:py-3 [&_.PhoneInputInput]:focus:ring-2 [&_.PhoneInputInput]:focus:ring-[#BF0637]/30 [&_.PhoneInputInput]:focus:border-[#BF0637]">
                <label className={labelClass}>Phone number</label>
                <PhoneInput
                  international
                  defaultCountry="US"
                  value={phoneNumber}
                  onChange={(v) => setPhoneNumber(v ?? "")}
                  numberInputProps={{ className: "!rounded-xl", required: true }}
                  placeholder="Enter phone number"
                />
              </div>
              {error && <p className="text-sm text-red-600 font-medium">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl font-bold text-white shadow-lg shadow-[#BF0637]/25 hover:shadow-[#BF0637]/40 transition-all disabled:opacity-70"
                style={{ backgroundColor: "#BF0637" }}
              >
                {loading ? "Sending…" : "Send OTP"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <p className="text-slate-600 text-sm">
                Code sent to <strong>{phoneNumber}</strong>. Enter it below.
              </p>
              <div>
                <label htmlFor="otp" className={labelClass}>OTP</label>
                <input
                  id="otp"
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
              {error && <p className="text-sm text-red-600 font-medium">{error}</p>}
              <button
                type="submit"
                disabled={loading || otp.length < 4}
                className="w-full py-3.5 rounded-xl font-bold text-white shadow-lg shadow-[#BF0637]/25 hover:shadow-[#BF0637]/40 transition-all disabled:opacity-70"
                style={{ backgroundColor: "#BF0637" }}
              >
                {loading ? "Verifying…" : "Verify & log in"}
              </button>
              <button
                type="button"
                onClick={() => { setStep("phone"); setOtp(""); setError(null); }}
                className="w-full text-sm font-semibold text-[#BF0637] hover:underline"
              >
                Use a different number
              </button>
            </form>
          )}
        </div>
      </div>
    </AuthPageWrapper>
  );
}
