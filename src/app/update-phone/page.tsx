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
const btnPrimary =
  "w-full py-3.5 rounded-xl font-bold text-white shadow-lg shadow-[#BF0637]/25 hover:shadow-[#BF0637]/40 transition-all disabled:opacity-70";

type Step = "phone" | "otp";

/**
 * Page for adding/updating phone after Google Sign-In when backend returns needsPhoneUpdate.
 * Flow: enter phone -> POST /auth/update-phone (sends OTP) -> enter OTP -> verify-otp -> profile.
 */
export default function UpdatePhonePage() {
  const router = useRouter();
  const { user, token, needsPhoneUpdate, updatePhone, verifyOtp, clearNeedsPhoneUpdate } = useAuth();
  const [step, setStep] = useState<Step>("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token && !user) {
      router.replace("/login");
      return;
    }
    if (user && !needsPhoneUpdate) {
      router.replace("/dashboard");
    }
  }, [user, token, needsPhoneUpdate, router]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const phone = (phoneNumber || "").toString().trim();
    if (!phone) {
      setError("Please enter your phone number");
      return;
    }
    setLoading(true);
    const { error: err } = await updatePhone(phone);
    setLoading(false);
    if (err) {
      toast.error(err);
      setError(err);
      return;
    }
    toast.success("Verification code sent to your phone.");
    setStep("otp");
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!otp.trim()) {
      setError("Please enter the OTP");
      return;
    }
    const phone = (phoneNumber || "").toString().trim();
    setLoading(true);
    const { error: err } = await verifyOtp(phone, otp.trim());
    setLoading(false);
    if (err) {
      toast.error(err);
      setError(err);
      return;
    }
    clearNeedsPhoneUpdate();
    toast.success("Phone number updated. Redirecting…");
    router.push("/dashboard");
  };

  if (!token && !user) return null;
  if (user && !needsPhoneUpdate) return null;

  const phoneValue = phoneNumber || undefined;

  return (
    <AuthPageWrapper>
      <div className="max-w-md mx-auto">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-slate-200/80 shadow-2xl p-5 sm:p-6">
          <h1 className="text-2xl font-bold text-slate-900 mb-0.5">Add your phone number</h1>
          <p className="text-slate-600 mb-4 text-sm">
            To complete your account, please add a phone number. We&apos;ll send a verification code.
          </p>

          {step === "phone" && (
            <form onSubmit={handleSendOtp} className="space-y-4">
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
                {loading ? "Sending…" : "Send verification code"}
              </button>
            </form>
          )}

          {step === "otp" && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <p className="text-slate-600 text-sm">
                Code sent to <strong>{phoneNumber}</strong>. Enter it below.
              </p>
              <div>
                <label htmlFor="up-otp" className={labelClass}>OTP</label>
                <input
                  id="up-otp"
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
                className={btnPrimary}
                style={{ backgroundColor: "#BF0637" }}
              >
                {loading ? "Verifying…" : "Verify & continue"}
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

        <p className="mt-4 text-center text-slate-600 text-sm">
          <button
            type="button"
            onClick={() => { clearNeedsPhoneUpdate(); router.push("/dashboard"); }}
            className="font-semibold text-[#BF0637] hover:underline"
          >
            Skip for now
          </button>
        </p>
      </div>
    </AuthPageWrapper>
  );
}
