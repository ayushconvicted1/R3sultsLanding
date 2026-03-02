"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useAuth, getStoredToken } from "@/context/AuthContext";
import type { AppUser } from "@/types/user";
import AuthPageWrapper from "@/components/auth/AuthPageWrapper";

const inputClass =
  "w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-[#BF0637]/30 focus:border-[#BF0637] transition-colors";
const labelClass = "block text-sm font-semibold text-slate-700 mb-1.5";

export default function ProfilePage() {
  const router = useRouter();
  const { user: authUser, loading: authLoading, refreshUser, needsPhoneUpdate } = useAuth();
  const [profile, setProfile] = useState<AppUser | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [form, setForm] = useState({
    fullName: "",
    username: "",
    email: "",
    dateOfBirth: "",
    gender: "",
    profilePictureUrl: "",
    address: "",
    city: "",
    state: "",
    country: "India",
    pincode: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    bloodGroup: "",
    medicalConditions: "",
  });
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState<"basic" | "address" | "emergency" | "medical" | null>(null);

  useEffect(() => {
    if (!authUser && !authLoading) {
      router.replace("/login");
      return;
    }
    if (authUser && needsPhoneUpdate) {
      router.replace("/update-phone");
    }
  }, [authUser, authLoading, needsPhoneUpdate, router]);

  useEffect(() => {
    if (!authUser) return;
    const token = getStoredToken();
    if (!token) return;
    let cancelled = false;
    setProfileLoading(true);
    fetch("/api/user/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        const u = data.user ?? authUser;
        setProfile(u);
        setForm({
          fullName: u.fullName ?? "",
          username: u.username ?? "",
          email: u.email ?? "",
          dateOfBirth: u.dateOfBirth ? String(u.dateOfBirth).slice(0, 10) : "",
          gender: u.gender ?? "",
          profilePictureUrl: u.profilePictureUrl ?? "",
          address: u.address ?? "",
          city: u.city ?? "",
          state: u.state ?? "",
          country: u.country ?? "India",
          pincode: u.pincode ?? "",
          emergencyContactName: u.emergencyContactName ?? "",
          emergencyContactPhone: u.emergencyContactPhone ?? "",
          bloodGroup: u.bloodGroup ?? "",
          medicalConditions: u.medicalConditions ?? "",
        });
      })
      .catch(() => {
        if (!cancelled) setProfile(authUser);
      })
      .finally(() => {
        if (!cancelled) setProfileLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [authUser]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const updateProfile = async (body: Record<string, unknown>, endpoint: string) => {
    const token = getStoredToken();
    if (!token) {
      router.replace("/login");
      return;
    }
    const res = await fetch(endpoint, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Update failed");
    if (data.user) setProfile(data.user);
    await refreshUser();
    return data;
  };

  const handleSaveBasic = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile(
        {
          fullName: form.fullName,
          username: form.username || undefined,
          email: form.email || undefined,
          dateOfBirth: form.dateOfBirth || undefined,
          gender: form.gender || undefined,
          profilePictureUrl: form.profilePictureUrl || undefined,
        },
        "/api/user/profile"
      );
      toast.success("Profile updated.");
      setActiveSection(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile(
        {
          address: form.address,
          city: form.city,
          state: form.state,
          country: form.country,
          pincode: form.pincode,
        },
        "/api/user/address"
      );
      toast.success("Address updated.");
      setActiveSection(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveEmergency = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile(
        {
          emergencyContactName: form.emergencyContactName,
          emergencyContactPhone: form.emergencyContactPhone,
        },
        "/api/user/emergency-contact"
      );
      toast.success("Emergency contact updated.");
      setActiveSection(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveMedical = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile(
        {
          bloodGroup: form.bloodGroup,
          medicalConditions: form.medicalConditions,
        },
        "/api/user/medical-info"
      );
      toast.success("Medical info updated.");
      setActiveSection(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update");
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || !authUser) {
    return (
      <AuthPageWrapper>
        <div className="max-w-2xl mx-auto text-center py-12 text-slate-500">Loading…</div>
      </AuthPageWrapper>
    );
  }

  const displayUser = profile ?? authUser;

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
            Signed in as <strong>{displayUser.phoneNumber || displayUser.email}</strong>. Manage your details below.
          </p>

          {profileLoading ? (
            <div className="py-8 text-slate-500 text-center">Loading profile…</div>
          ) : (
            <div className="space-y-6">
              {/* Basic info – API: PATCH /api/user/profile (fullName, username, email, dateOfBirth, gender, profilePictureUrl) */}
              <section className="border border-slate-200 rounded-xl p-4">
                <h2 className="text-lg font-bold text-slate-900 mb-3">Basic info</h2>
                {(activeSection === "basic" || activeSection === null) && (
                  <form onSubmit={handleSaveBasic} className="space-y-4">
                    <div>
                      <label htmlFor="fullName" className={labelClass}>Full name</label>
                      <input
                        id="fullName"
                        name="fullName"
                        type="text"
                        value={form.fullName}
                        onChange={handleChange}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label htmlFor="username" className={labelClass}>Username</label>
                      <input id="username" name="username" type="text" value={form.username} onChange={handleChange} className={inputClass} />
                    </div>
                    <div>
                      <label htmlFor="email" className={labelClass}>Email</label>
                      <input id="email" name="email" type="email" value={form.email} onChange={handleChange} className={inputClass} />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="dateOfBirth" className={labelClass}>Date of birth</label>
                        <input
                          id="dateOfBirth"
                          name="dateOfBirth"
                          type="date"
                          value={form.dateOfBirth}
                          onChange={handleChange}
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label htmlFor="gender" className={labelClass}>Gender</label>
                        <select id="gender" name="gender" value={form.gender} onChange={handleChange} className={inputClass}>
                          <option value="">—</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="profilePictureUrl" className={labelClass}>Profile picture URL</label>
                      <input
                        id="profilePictureUrl"
                        name="profilePictureUrl"
                        type="url"
                        value={form.profilePictureUrl}
                        onChange={handleChange}
                        className={inputClass}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-6 py-3 rounded-xl font-bold text-white shadow-lg shadow-[#BF0637]/25 hover:shadow-[#BF0637]/40 transition-all disabled:opacity-70"
                      style={{ backgroundColor: "#BF0637" }}
                    >
                      {saving ? "Saving…" : "Save basic info"}
                    </button>
                  </form>
                )}
                {activeSection !== null && activeSection !== "basic" && (
                  <button
                    type="button"
                    onClick={() => setActiveSection("basic")}
                    className="text-[#BF0637] font-medium hover:underline"
                  >
                    Edit basic info
                  </button>
                )}
              </section>

              {/* Address – API: PATCH /api/user/address */}
              <section className="border border-slate-200 rounded-xl p-4">
                <h2 className="text-lg font-bold text-slate-900 mb-3">Address</h2>
                {(activeSection === "address" || activeSection === null) && (
                  <form onSubmit={handleSaveAddress} className="space-y-4">
                    <div>
                      <label htmlFor="address" className={labelClass}>Address</label>
                      <input id="address" name="address" type="text" value={form.address} onChange={handleChange} className={inputClass} />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="city" className={labelClass}>City</label>
                        <input id="city" name="city" type="text" value={form.city} onChange={handleChange} className={inputClass} />
                      </div>
                      <div>
                        <label htmlFor="state" className={labelClass}>State</label>
                        <input id="state" name="state" type="text" value={form.state} onChange={handleChange} className={inputClass} />
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="country" className={labelClass}>Country</label>
                        <input id="country" name="country" type="text" value={form.country} onChange={handleChange} className={inputClass} />
                      </div>
                      <div>
                        <label htmlFor="pincode" className={labelClass}>Pincode</label>
                        <input id="pincode" name="pincode" type="text" value={form.pincode} onChange={handleChange} className={inputClass} />
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-6 py-3 rounded-xl font-bold text-white shadow-lg shadow-[#BF0637]/25 hover:shadow-[#BF0637]/40 transition-all disabled:opacity-70"
                      style={{ backgroundColor: "#BF0637" }}
                    >
                      {saving ? "Saving…" : "Save address"}
                    </button>
                  </form>
                )}
                {activeSection !== null && activeSection !== "address" && (
                  <button
                    type="button"
                    onClick={() => setActiveSection("address")}
                    className="text-[#BF0637] font-medium hover:underline"
                  >
                    Edit address
                  </button>
                )}
              </section>

              {/* Emergency contact – API: PATCH /api/user/emergency-contact */}
              <section className="border border-slate-200 rounded-xl p-4">
                <h2 className="text-lg font-bold text-slate-900 mb-3">Emergency contact</h2>
                {(activeSection === "emergency" || activeSection === null) && (
                  <form onSubmit={handleSaveEmergency} className="space-y-4">
                    <div>
                      <label htmlFor="emergencyContactName" className={labelClass}>Name</label>
                      <input
                        id="emergencyContactName"
                        name="emergencyContactName"
                        type="text"
                        value={form.emergencyContactName}
                        onChange={handleChange}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label htmlFor="emergencyContactPhone" className={labelClass}>Phone</label>
                      <input
                        id="emergencyContactPhone"
                        name="emergencyContactPhone"
                        type="tel"
                        value={form.emergencyContactPhone}
                        onChange={handleChange}
                        className={inputClass}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-6 py-3 rounded-xl font-bold text-white shadow-lg shadow-[#BF0637]/25 hover:shadow-[#BF0637]/40 transition-all disabled:opacity-70"
                      style={{ backgroundColor: "#BF0637" }}
                    >
                      {saving ? "Saving…" : "Save emergency contact"}
                    </button>
                  </form>
                )}
                {activeSection !== null && activeSection !== "emergency" && (
                  <button
                    type="button"
                    onClick={() => setActiveSection("emergency")}
                    className="text-[#BF0637] font-medium hover:underline"
                  >
                    Edit emergency contact
                  </button>
                )}
              </section>

              {/* Medical info – API: PATCH /api/user/medical-info */}
              <section className="border border-slate-200 rounded-xl p-4">
                <h2 className="text-lg font-bold text-slate-900 mb-3">Medical info</h2>
                {(activeSection === "medical" || activeSection === null) && (
                  <form onSubmit={handleSaveMedical} className="space-y-4">
                    <div>
                      <label htmlFor="bloodGroup" className={labelClass}>Blood group</label>
                      <select id="bloodGroup" name="bloodGroup" value={form.bloodGroup} onChange={handleChange} className={inputClass}>
                        <option value="">—</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="medicalConditions" className={labelClass}>Medical conditions</label>
                      <textarea
                        id="medicalConditions"
                        name="medicalConditions"
                        rows={3}
                        value={form.medicalConditions}
                        onChange={handleChange}
                        className={inputClass}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-6 py-3 rounded-xl font-bold text-white shadow-lg shadow-[#BF0637]/25 hover:shadow-[#BF0637]/40 transition-all disabled:opacity-70"
                      style={{ backgroundColor: "#BF0637" }}
                    >
                      {saving ? "Saving…" : "Save medical info"}
                    </button>
                  </form>
                )}
                {activeSection !== null && activeSection !== "medical" && (
                  <button
                    type="button"
                    onClick={() => setActiveSection("medical")}
                    className="text-[#BF0637] font-medium hover:underline"
                  >
                    Edit medical info
                  </button>
                )}
              </section>
            </div>
          )}

          <div className="flex flex-wrap gap-3 pt-6 mt-6 border-t border-slate-200">
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
        </div>
      </div>
    </AuthPageWrapper>
  );
}
