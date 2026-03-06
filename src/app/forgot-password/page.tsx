"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import AuthPageWrapper from "@/components/auth/AuthPageWrapper";
import PasswordInput from "@/components/auth/PasswordInput";

const inputClass =
  "w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-[#BF0637]/30 focus:border-[#BF0637] transition-colors";
const labelClass = "block text-sm font-semibold text-slate-700 mb-1";
const btnPrimary =
  "w-full py-3.5 rounded-xl font-bold text-white shadow-lg shadow-[#BF0637]/25 hover:shadow-[#BF0637]/40 transition-all disabled:opacity-70";

type Step = "phone" | "reset";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const phone = (phoneNumber || "").toString().trim();
    if (!phone) {
      setError("Please enter your phone number");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: phone }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Request failed");
        setLoading(false);
        return;
      }
      toast.success("If an account exists, you will receive a code to reset your password.");
      setStep("reset");
    } catch {
      setError("Request failed");
    }
    setLoading(false);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const phone = (phoneNumber || "").toString().trim();
    if (!otp.trim()) {
      setError("Please enter the OTP");
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber: phone,
          otp: otp.trim(),
          newPassword: newPassword.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Reset failed");
        setLoading(false);
        return;
      }
      toast.success("Password reset. Please log in with your new password.");
      router.push("/login");
    } catch {
      setError("Reset failed");
    }
    setLoading(false);
  };

  const phoneValue = phoneNumber || undefined;

  return (
    <AuthPageWrapper>
      <div className="max-w-md mx-auto">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-slate-200/80 shadow-2xl p-5 sm:p-6">
          <h1 className="text-2xl font-bold text-slate-900 mb-0.5">Forgot password</h1>
          <p className="text-slate-600 mb-4 text-sm">
            Enter your phone number. We&apos;ll send a code to reset your password.
          </p>

          {step === "phone" && (
            <form onSubmit={handleRequestReset} className="space-y-4">
              <div className="[&_.PhoneInput]:flex [&_.PhoneInput]:gap-2 [&_.PhoneInputInput]:flex-1 [&_.PhoneInputInput]:border-2 [&_.PhoneInputInput]:border-slate-200 [&_.PhoneInputInput]:rounded-xl [&_.PhoneInputInput]:px-4 [&_.PhoneInputInput]:py-3 [&_.PhoneInputInput]:focus:ring-2 [&_.PhoneInputInput]:focus:ring-[#BF0637]/30 [&_.PhoneInputInput]:focus:border-[#BF0637]">
                <label className={labelClass}>Phone number</label>
                <PhoneInput
                  international
                  defaultCountry="US"
                  value={phoneValue}
                  onChange={(v) => setPhoneNumber(v ?? "")}
                  numberInputProps={{ className: "!rounded-xl", required: true }}
                  placeholder="Enter phone number"
                />
              </div>
              {error && <p className="text-sm text-red-600 font-medium">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className={btnPrimary}
                style={{ backgroundColor: "#BF0637" }}
              >
                {loading ? "Sending…" : "Send reset code"}
              </button>
            </form>
          )}

          {step === "reset" && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <p className="text-slate-600 text-sm">
                Enter the code sent to <strong>{phoneNumber}</strong> and your new password.
              </p>
              <div>
                <label htmlFor="fp-otp" className={labelClass}>OTP</label>
                <input
                  id="fp-otp"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  className={inputClass}
                  placeholder="000000"
                />
              </div>
              <div>
                <label htmlFor="fp-newPassword" className={labelClass}>New password (min 6 characters)</label>
                <PasswordInput
                  id="fp-newPassword"
                  value={newPassword}
                  onChange={setNewPassword}
                  placeholder="New password"
                  required
                  minLength={6}
                />
              </div>
              {error && <p className="text-sm text-red-600 font-medium">{error}</p>}
              <button
                type="submit"
                disabled={loading || otp.length < 4 || newPassword.length < 6}
                className={btnPrimary}
                style={{ backgroundColor: "#BF0637" }}
              >
                {loading ? "Resetting…" : "Reset password"}
              </button>
              <button
                type="button"
                onClick={() => { setStep("phone"); setOtp(""); setNewPassword(""); setError(null); }}
                className="w-full text-sm font-semibold text-[#BF0637] hover:underline"
              >
                Use a different number
              </button>
            </form>
          )}
        </div>

        <p className="mt-4 text-center text-slate-600 text-sm">
          <Link href="/login" className="font-semibold text-[#BF0637] hover:underline">
            Back to log in
          </Link>
        </p>
      </div>
    </AuthPageWrapper>
  );
}
