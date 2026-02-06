"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";
import type { UserAddress } from "@/context/AuthContext";
import AuthPageWrapper from "@/components/auth/AuthPageWrapper";
import PasswordInput from "@/components/auth/PasswordInput";

const inputClass =
  "w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-[#BF0637]/30 focus:border-[#BF0637] transition-colors";
const labelClass = "block text-sm font-semibold text-slate-700 mb-1";

const defaultAddress: UserAddress = {
  line1: "",
  line2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "US",
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignupPage() {
  const router = useRouter();
  const { signup, user } = useAuth();
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phone: "",
    ...defaultAddress,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) router.replace("/profile");
  }, [user, router]);

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
    if (!form.email.trim()) next.email = "Email is required";
    else if (!EMAIL_REGEX.test(form.email)) next.email = "Enter a valid email address";
    if (!form.password) next.password = "Password is required";
    else if (form.password.length < 6) next.password = "Password must be at least 6 characters";
    if (form.password !== form.confirmPassword) next.confirmPassword = "Passwords do not match";
    else if (!form.confirmPassword) next.confirmPassword = "Please confirm your password";
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
    const { error: err } = await signup({
      email: form.email,
      password: form.password,
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
    });
    setLoading(false);
    if (err) {
      toast.error(err);
      return;
    }
    toast.success("Account created! Redirecting…");
    router.push("/profile");
  };

  const passwordMatch = form.confirmPassword
    ? form.password === form.confirmPassword
    : null;

  if (user) return null;

  return (
    <AuthPageWrapper>
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-slate-200/80 shadow-2xl p-5 sm:p-6">
          <h1 className="text-2xl font-bold text-slate-900 mb-0.5">Create account</h1>
          <p className="text-slate-600 mb-4 text-sm">Sign up with your details. Address matches checkout format.</p>

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
            <div>
              <label htmlFor="email" className={labelClass}>Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                className={`${inputClass} ${errors.email ? "border-red-300" : ""}`}
                aria-invalid={!!errors.email}
              />
              {errors.email && <p className="mt-1.5 text-sm text-red-600 font-medium">{errors.email}</p>}
            </div>
            <div className="[&_.PhoneInput]:flex [&_.PhoneInput]:gap-2 [&_.PhoneInputInput]:flex-1 [&_.PhoneInputInput]:border-2 [&_.PhoneInputInput]:border-slate-200 [&_.PhoneInputInput]:rounded-xl [&_.PhoneInputInput]:px-4 [&_.PhoneInputInput]:py-3 [&_.PhoneInputInput]:focus:ring-2 [&_.PhoneInputInput]:focus:ring-[#BF0637]/30 [&_.PhoneInputInput]:focus:border-[#BF0637]">
              <label className={labelClass}>Phone (optional)</label>
              <PhoneInput
                international
                defaultCountry="US"
                value={form.phone}
                onChange={setPhone}
                numberInputProps={{ className: "!rounded-xl" }}
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="password" className={labelClass}>Password</label>
                <PasswordInput
                  id="password"
                  value={form.password}
                  onChange={(v) => { setForm((p) => ({ ...p, password: v })); setErrors((e) => ({ ...e, password: "" })); }}
                  placeholder="At least 6 characters"
                  required
                  minLength={6}
                  error={errors.password}
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className={labelClass}>Confirm password</label>
                <PasswordInput
                  id="confirmPassword"
                  value={form.confirmPassword}
                  onChange={(v) => { setForm((p) => ({ ...p, confirmPassword: v })); setErrors((e) => ({ ...e, confirmPassword: "" })); }}
                  required
                  error={errors.confirmPassword}
                />
                {passwordMatch === true && (
                  <p className="mt-1.5 text-sm text-emerald-600 font-medium flex items-center gap-1">
                    <span aria-hidden>✓</span> Passwords match
                  </p>
                )}
              </div>
            </div>

            <div className="border-t border-slate-200 pt-4 mt-4">
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

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-bold text-white shadow-lg shadow-[#BF0637]/25 hover:shadow-[#BF0637]/40 transition-all disabled:opacity-70"
              style={{ backgroundColor: "#BF0637" }}
            >
              {loading ? "Creating account…" : "Create account"}
            </button>
            <p className="text-center text-slate-600 text-sm">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-[#BF0637] hover:underline">Log in</Link>
            </p>
          </form>
        </div>
      </div>
    </AuthPageWrapper>
  );
}
