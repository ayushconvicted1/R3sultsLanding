"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";
import { getStoredToken } from "@/context/AuthContext";
import AuthPageWrapper from "@/components/auth/AuthPageWrapper";
import PasswordInput from "@/components/auth/PasswordInput";

const labelClass = "block text-sm font-semibold text-slate-700 mb-1.5";

export default function ChangePasswordPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user && !authLoading) router.replace("/login");
  }, [user, authLoading, router]);

  const validate = () => {
    const next: Record<string, string> = {};
    if (!currentPassword) next.currentPassword = "Current password is required";
    if (!newPassword) next.newPassword = "New password is required";
    else if (newPassword.length < 6) next.newPassword = "New password must be at least 6 characters";
    if (newPassword !== confirmPassword) next.confirmPassword = "Passwords do not match";
    else if (!confirmPassword) next.confirmPassword = "Please confirm your new password";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fix the errors below.");
      return;
    }
    const token = getStoredToken();
    if (!token) {
      router.replace("/login");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to change password");
        setErrors((p) => ({ ...p, currentPassword: data.error || "Incorrect" }));
        return;
      }
      setSuccess(true);
      toast.success("Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const passwordMatch = confirmPassword ? newPassword === confirmPassword : null;

  if (authLoading || !user) {
    return (
      <AuthPageWrapper>
        <div className="max-w-md mx-auto text-center py-12 text-slate-500">Loading…</div>
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
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Password updated</h1>
            <p className="text-slate-600 mb-6">Your password has been changed successfully.</p>
            <Link
              href="/profile"
              className="inline-block px-6 py-3 rounded-xl font-semibold text-white"
              style={{ backgroundColor: "#BF0637" }}
            >
              Back to profile
            </Link>
          </div>
        </div>
      </AuthPageWrapper>
    );
  }

  return (
    <AuthPageWrapper>
      <div className="max-w-md mx-auto">
        <Link
          href="/profile"
          className="inline-flex items-center gap-2 text-slate-700 hover:text-[#BF0637] font-medium mb-6 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to profile
        </Link>
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-slate-200/80 shadow-2xl p-5 sm:p-6">
          <h1 className="text-2xl font-bold text-slate-900 mb-0.5">Change password</h1>
          <p className="text-slate-600 mb-4 text-sm">Enter your current password and choose a new one.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="currentPassword" className={labelClass}>Current password</label>
              <PasswordInput
                id="currentPassword"
                value={currentPassword}
                onChange={setCurrentPassword}
                required
                error={errors.currentPassword}
              />
            </div>
            <div>
              <label htmlFor="newPassword" className={labelClass}>New password</label>
              <PasswordInput
                id="newPassword"
                value={newPassword}
                onChange={(v) => { setNewPassword(v); setErrors((p) => ({ ...p, newPassword: "" })); }}
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
                onChange={(v) => { setConfirmPassword(v); setErrors((p) => ({ ...p, confirmPassword: "" })); }}
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
          </form>
        </div>
      </div>
    </AuthPageWrapper>
  );
}
