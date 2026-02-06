"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import AuthPageWrapper from "@/components/auth/AuthPageWrapper";
import PasswordInput from "@/components/auth/PasswordInput";

const labelClass = "block text-sm font-semibold text-slate-700 mb-1.5";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{ newPassword?: string; confirmPassword?: string }>({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const next: { newPassword?: string; confirmPassword?: string } = {};
    if (!newPassword) next.newPassword = "Password is required";
    else if (newPassword.length < 6) next.newPassword = "Password must be at least 6 characters";
    if (newPassword !== confirmPassword) next.confirmPassword = "Passwords do not match";
    else if (!confirmPassword) next.confirmPassword = "Please confirm your password";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fix the errors below.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to reset password");
        setErrors({ newPassword: data.error || "Failed" });
        return;
      }
      setSuccess(true);
      toast.success("Password updated. You can now log in.");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const passwordMatch = confirmPassword ? newPassword === confirmPassword : null;

  if (!token) {
    return (
      <AuthPageWrapper>
        <div className="max-w-md mx-auto">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-slate-200/80 shadow-2xl p-8 text-center">
            <p className="text-slate-600 mb-6">Invalid reset link. Please request a new password reset.</p>
            <Link href="/forgot-password" className="font-semibold text-[#BF0637] hover:underline">
              Forgot password
            </Link>
          </div>
        </div>
      </AuthPageWrapper>
    );
  }

  if (success) {
    return (
      <AuthPageWrapper>
        <div className="max-w-md mx-auto">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-slate-200/80 shadow-2xl p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Password reset</h1>
            <p className="text-slate-600 mb-6">Your password has been updated. You can now log in.</p>
            <Link
              href="/login"
              className="inline-block px-6 py-3 rounded-xl font-semibold text-white"
              style={{ backgroundColor: "#BF0637" }}
            >
              Log in
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
          <h1 className="text-2xl font-bold text-slate-900 mb-0.5">Set new password</h1>
          <p className="text-slate-600 mb-4 text-sm">Enter your new password below.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="newPassword" className={labelClass}>New password</label>
              <PasswordInput
                id="newPassword"
                value={newPassword}
                onChange={(v) => { setNewPassword(v); setErrors((p) => ({ ...p, newPassword: undefined })); }}
                placeholder="At least 6 characters"
                required
                minLength={6}
                error={errors.newPassword}
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className={labelClass}>Confirm new password</label>
              <PasswordInput
                id="confirmPassword"
                value={confirmPassword}
                onChange={(v) => { setConfirmPassword(v); setErrors((p) => ({ ...p, confirmPassword: undefined })); }}
                required
                error={errors.confirmPassword}
              />
              {passwordMatch === true && (
                <p className="mt-1.5 text-sm text-emerald-600 font-medium flex items-center gap-1">✓ Passwords match</p>
              )}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-bold text-white shadow-lg shadow-[#BF0637]/25 hover:shadow-[#BF0637]/40 transition-all disabled:opacity-70"
              style={{ backgroundColor: "#BF0637" }}
            >
              {loading ? "Updating…" : "Update password"}
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <AuthPageWrapper>
        <div className="max-w-md mx-auto text-center py-12 text-slate-500">Loading…</div>
      </AuthPageWrapper>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
