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
  "w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-[#BF0637]/30 focus:border-[#BF0637] transition-colors";
const labelClass = "block text-sm font-semibold text-slate-700 mb-1";
const btnPrimary =
  "w-full py-3.5 rounded-xl font-bold text-white shadow-lg shadow-[#BF0637]/25 hover:shadow-[#BF0637]/40 transition-all disabled:opacity-70";

type Step = "form" | "otp";

export default function RegisterPage() {
  const router = useRouter();
  const { register, verifyOtp, user } = useAuth();
  const [step, setStep] = useState<Step>("form");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) router.replace("/profile");
  }, [user, router]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const phone = (phoneNumber || "").toString().trim();
    if (!phone) {
      setError("Please enter your phone number");
      return;
    }
    if (!fullName.trim()) {
      setError("Please enter your full name");
      return;
    }
    if (!password) {
      setError("Please enter a password (min 6 characters)");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    const { error: err } = await register({
      phoneNumber: phone,
      password,
      fullName: fullName.trim(),
      email: email.trim() || undefined,
      username: username.trim() || undefined,
    });
    setLoading(false);
    if (err) {
      toast.error(err);
      setError(err);
      return;
    }
    toast.success("Account created. Enter the verification code sent to your phone.");
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
    toast.success("You're all set! Redirecting…");
    router.push("/profile");
  };

  if (user) return null;

  const phoneValue = phoneNumber || undefined;

  return (
    <AuthPageWrapper>
      <div className="max-w-md mx-auto">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-slate-200/80 shadow-2xl p-5 sm:p-6">
          <h1 className="text-2xl font-bold text-slate-900 mb-0.5">Sign up</h1>
          <p className="text-slate-600 mb-4 text-sm">
            Create an account with your phone number or sign in with Google.
          </p>

          <GoogleSignInButton className="mb-4" text="signup_with" onSuccessRedirect="/profile" />

          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white/95 px-3 text-slate-500">or register with phone</span>
            </div>
          </div>

          {step === "form" && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="[&_.PhoneInput]:flex [&_.PhoneInput]:gap-2 [&_.PhoneInputInput]:flex-1 [&_.PhoneInputInput]:border-2 [&_.PhoneInputInput]:border-slate-200 [&_.PhoneInputInput]:rounded-xl [&_.PhoneInputInput]:px-4 [&_.PhoneInputInput]:py-3 [&_.PhoneInputInput]:focus:ring-2 [&_.PhoneInputInput]:focus:ring-[#BF0637]/30 [&_.PhoneInputInput]:focus:border-[#BF0637]">
                <label className={labelClass}>Phone number *</label>
                <PhoneInput
                  international
                  defaultCountry="US"
                  value={phoneValue}
                  onChange={(v) => setPhoneNumber(v ?? "")}
                  numberInputProps={{ className: "!rounded-xl", required: true }}
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <label htmlFor="reg-fullName" className={labelClass}>Full name *</label>
                <input
                  id="reg-fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={inputClass}
                  placeholder="John Doe"
                  required
                />
              </div>
              <div>
                <label htmlFor="reg-password" className={labelClass}>Password (min 6 characters) *</label>
                <PasswordInput
                  id="reg-password"
                  value={password}
                  onChange={setPassword}
                  placeholder="Choose a password"
                  required
                  minLength={6}
                />
              </div>
              <div>
                <label htmlFor="reg-email" className={labelClass}>Email (optional)</label>
                <input
                  id="reg-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label htmlFor="reg-username" className={labelClass}>Username (optional)</label>
                <input
                  id="reg-username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={inputClass}
                  placeholder="username"
                />
              </div>
              {error && <p className="text-sm text-red-600 font-medium">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className={btnPrimary}
                style={{ backgroundColor: "#BF0637" }}
              >
                {loading ? "Creating account…" : "Create account"}
              </button>
            </form>
          )}

          {step === "otp" && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <p className="text-slate-600 text-sm">
                Code sent to <strong>{phoneNumber}</strong>. Enter it below to verify.
              </p>
              <div>
                <label htmlFor="reg-otp" className={labelClass}>OTP</label>
                <input
                  id="reg-otp"
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
                onClick={() => { setStep("form"); setOtp(""); setError(null); }}
                className="w-full text-sm font-semibold text-[#BF0637] hover:underline"
              >
                Use a different number
              </button>
            </form>
          )}
        </div>

        <p className="mt-4 text-center text-slate-600 text-sm">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-[#BF0637] hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </AuthPageWrapper>
  );
}
