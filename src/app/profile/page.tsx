"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";
import { getStoredToken } from "@/context/AuthContext";
import AuthPageWrapper from "@/components/auth/AuthPageWrapper";

const inputClass =
  "w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-[#BF0637]/30 focus:border-[#BF0637] transition-colors";
const labelClass = "block text-sm font-semibold text-slate-700 mb-1.5";

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading: authLoading, refreshUser } = useAuth();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "US",
  });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!user && !authLoading) {
      router.replace("/login");
      return;
    }
    if (user) {
      setForm({
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        line1: user.address?.line1 ?? "",
        line2: user.address?.line2 ?? "",
        city: user.address?.city ?? "",
        state: user.address?.state ?? "",
        postalCode: user.address?.postalCode ?? "",
        country: user.address?.country ?? "US",
      });
    }
  }, [user, authLoading, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };
  const setPhone = (value: string | undefined) => {
    setForm((prev) => ({ ...prev, phone: value ?? "" }));
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.firstName.trim()) next.firstName = "First name is required";
    if (!form.lastName.trim()) next.lastName = "Last name is required";
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
    setSaving(true);
    try {
      const res = await fetch("/api/auth/me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          phone: form.phone,
          address: {
            line1: form.line1,
            line2: form.line2,
            city: form.city,
            state: form.state,
            postalCode: form.postalCode,
            country: form.country,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to update");
        return;
      }
      await refreshUser();
      toast.success("Profile updated successfully.");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || !user) {
    return (
      <AuthPageWrapper>
        <div className="max-w-2xl mx-auto text-center py-12 text-slate-500">Loading…</div>
      </AuthPageWrapper>
    );
  }

  return (
    <AuthPageWrapper>
      <div className="max-w-2xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-slate-700 hover:text-[#BF0637] font-medium mb-6 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Home
        </Link>
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-slate-200/80 shadow-2xl p-5 sm:p-6">
          <h1 className="text-2xl font-bold text-slate-900 mb-0.5">Profile</h1>
          <p className="text-slate-600 mb-4 text-sm">
            Signed in as <strong>{user.email}</strong>. Update your details below.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className={labelClass}>First name</label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  value={form.firstName}
                  onChange={handleChange}
                  className={`${inputClass} ${errors.firstName ? "border-red-300" : ""}`}
                  aria-invalid={!!errors.firstName}
                />
                {errors.firstName && <p className="mt-1.5 text-sm text-red-600 font-medium">{errors.firstName}</p>}
              </div>
              <div>
                <label htmlFor="lastName" className={labelClass}>Last name</label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  value={form.lastName}
                  onChange={handleChange}
                  className={`${inputClass} ${errors.lastName ? "border-red-300" : ""}`}
                  aria-invalid={!!errors.lastName}
                />
                {errors.lastName && <p className="mt-1.5 text-sm text-red-600 font-medium">{errors.lastName}</p>}
              </div>
            </div>
            <div className="[&_.PhoneInput]:flex [&_.PhoneInput]:gap-2 [&_.PhoneInputInput]:flex-1 [&_.PhoneInputInput]:border-2 [&_.PhoneInputInput]:border-slate-200 [&_.PhoneInputInput]:rounded-xl [&_.PhoneInputInput]:px-4 [&_.PhoneInputInput]:py-3 [&_.PhoneInputInput]:focus:ring-2 [&_.PhoneInputInput]:focus:ring-[#BF0637]/30 [&_.PhoneInputInput]:focus:border-[#BF0637]">
              <label className={labelClass}>Phone</label>
              <PhoneInput
                international
                defaultCountry="US"
                value={form.phone}
                onChange={setPhone}
                numberInputProps={{ className: "!rounded-xl" }}
              />
            </div>
            <div className="border-t border-slate-200 pt-4">
              <h2 className="text-base font-bold text-slate-900 mb-3">Address</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="line1" className={labelClass}>Address line 1</label>
                  <input id="line1" name="line1" type="text" value={form.line1} onChange={handleChange} className={inputClass} />
                </div>
                <div>
                  <label htmlFor="line2" className={labelClass}>Address line 2 (optional)</label>
                  <input id="line2" name="line2" type="text" value={form.line2} onChange={handleChange} className={inputClass} />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="city" className={labelClass}>City</label>
                    <input id="city" name="city" type="text" value={form.city} onChange={handleChange} className={inputClass} />
                  </div>
                  <div>
                    <label htmlFor="state" className={labelClass}>State / Province</label>
                    <input id="state" name="state" type="text" value={form.state} onChange={handleChange} className={inputClass} />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="postalCode" className={labelClass}>ZIP / Postal code</label>
                    <input id="postalCode" name="postalCode" type="text" value={form.postalCode} onChange={handleChange} className={inputClass} />
                  </div>
                  <div>
                    <label htmlFor="country" className={labelClass}>Country</label>
                    <select id="country" name="country" value={form.country} onChange={handleChange} className={inputClass}>
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="GB">United Kingdom</option>
                      <option value="IN">India</option>
                      <option value="AU">Australia</option>
                      <option value="DE">Germany</option>
                      <option value="FR">France</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 pt-4">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 rounded-xl font-bold text-white shadow-lg shadow-[#BF0637]/25 hover:shadow-[#BF0637]/40 transition-all disabled:opacity-70"
                style={{ backgroundColor: "#BF0637" }}
              >
                {saving ? "Saving…" : "Save changes"}
              </button>
              <Link
                href="/change-password"
                className="inline-flex items-center px-6 py-3 rounded-xl font-semibold border-2 border-slate-300 text-slate-700 hover:border-[#BF0637] hover:text-[#BF0637] transition-colors"
              >
                Change password
              </Link>
              <Link
                href="/account/orders"
                className="inline-flex items-center px-6 py-3 rounded-xl font-semibold border-2 border-slate-300 text-slate-700 hover:border-[#BF0637] hover:text-[#BF0637] transition-colors"
              >
                Order history
              </Link>
            </div>
          </form>
        </div>
      </div>
    </AuthPageWrapper>
  );
}
