"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { useCart, getCartLineKey } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import type { ShippingAddress } from "@/types/checkout";
import { fullNameToFirstLast } from "@/types/user";

const SHIPPING_ESTIMATE = 5.99;
const CHECKOUT_GUEST_FLAG = "r3sults_checkout_guest";

export default function CheckoutPage() {
  const { items, totalItems, cartSection } = useCart();
  const { user, loading: authLoading } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<ShippingAddress>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "US",
  });
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);
  const [billingAddress, setBillingAddress] = useState<ShippingAddress>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "US",
  });

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted || authLoading) return;
    if (cartSection === "merch") {
      window.location.href = "/merch/checkout";
      return;
    }
    if (user) return;
    const hasGuestAccess =
      typeof window !== "undefined" && sessionStorage.getItem(CHECKOUT_GUEST_FLAG) === "1";
    if (!hasGuestAccess) {
      window.location.href = "/checkout-access?next=/checkout";
    }
  }, [mounted, authLoading, user, cartSection]);

  useEffect(() => {
    if (user && mounted) {
      const { firstName, lastName } = fullNameToFirstLast(user.fullName);
      setForm((prev) => ({
        ...prev,
        firstName: firstName || prev.firstName,
        lastName: lastName || prev.lastName,
        email: user.email || prev.email,
        phone: user.phoneNumber || prev.phone,
        line1: user.address || prev.line1,
        line2: prev.line2,
        city: user.city || prev.city,
        state: user.state || prev.state,
        postalCode: user.pincode || prev.postalCode,
        country: user.country || prev.country,
      }));
    }
  }, [user, mounted]);

  const subtotal = items.reduce(
    (s, i) => s + i.product.price * i.quantity,
    0
  );
  const total = subtotal + SHIPPING_ESTIMATE;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  const setPhone = (value: string | undefined) => {
    setForm((prev) => ({ ...prev, phone: value ?? "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const lineItems = items.map((item) => {
        const parts: string[] = [];
        if (item.selectedSize) parts.push(`Size: ${item.selectedSize}`);
        if (item.selectedColor) parts.push(`Color: ${item.selectedColor}`);
        const description = parts.length ? parts.join(" • ") : undefined;
        const productDescription = item.product.description
          ? String(item.product.description).slice(0, 500)
          : undefined;
        return {
          productId: item.product.id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          image: item.product.image?.startsWith("http") ? item.product.image : undefined,
          description,
          size: item.selectedSize,
          color: item.selectedColor,
          productDescription,
        };
      });
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lineItems,
          shippingAddress: form,
          billingSameAsShipping,
          billingAddress: billingSameAsShipping ? undefined : billingAddress,
          shippingAmount: SHIPPING_ESTIMATE,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Checkout failed");
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      throw new Error("No checkout URL returned");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-3 py-2.5 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-[#BF0637]/30 focus:border-[#BF0637] transition-colors text-sm";
  const labelClass = "block text-sm font-semibold text-slate-700 mb-1";

  if (!mounted) {
    return (
      <div className="min-h-screen pt-24 pb-8 px-4 relative" style={{ backgroundImage: "url('/HeroBG.png')", backgroundSize: "cover", backgroundPosition: "center" }}>
        <div className="absolute inset-0 bg-white/90 backdrop-blur-[2px]" aria-hidden />
        <div className="relative z-10 max-w-md mx-auto flex items-center justify-center min-h-[50vh]">
          <p className="text-slate-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-24 pb-8 px-4 relative" style={{ backgroundImage: "url('/HeroBG.png')", backgroundSize: "cover", backgroundPosition: "center" }}>
        <div className="absolute inset-0 bg-white/90 backdrop-blur-[2px]" aria-hidden />
        <div className="relative z-10 max-w-md mx-auto flex flex-col items-center justify-center min-h-[50vh]">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-slate-200/80 shadow-2xl p-6 text-center w-full">
            <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
              <svg className="w-7 h-7 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-slate-900 mb-1">Your cart is empty</h1>
            <p className="text-slate-600 mb-5 text-sm">Add items from the shop to checkout.</p>
            <Link href="/shop" className="inline-block px-6 py-3 rounded-xl font-semibold text-white text-sm" style={{ backgroundColor: "#BF0637" }}>
              Continue shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-8 px-4 sm:px-5 relative" style={{ backgroundImage: "url('/HeroBG.png')", backgroundSize: "cover", backgroundPosition: "center" }}>
      <div className="absolute inset-0 bg-white/88 backdrop-blur-[2px]" aria-hidden />
      <div className="relative z-10 max-w-6xl mx-auto">
        <Link href="/shop" className="inline-flex items-center gap-2 text-slate-600 hover:text-[#BF0637] font-medium mb-5 text-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to shop
        </Link>

        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Checkout</h1>
          <p className="text-slate-600 text-sm mt-0.5">Complete your order securely</p>
        </div>

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2 space-y-5">
            <section className="bg-white/95 backdrop-blur-sm rounded-2xl border border-slate-200/80 shadow-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-200 flex items-center gap-2" style={{ background: "linear-gradient(to right, #fef2f2, #fff)" }}>
                <span className="w-7 h-7 rounded-lg bg-[#BF0637]/15 text-[#BF0637] flex items-center justify-center text-xs font-bold">1</span>
                <h2 className="text-base font-bold text-slate-900">Shipping address</h2>
              </div>
              <div className="p-5 sm:p-6 grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className={labelClass}>First name</label>
                  <input id="firstName" name="firstName" type="text" required value={form.firstName} onChange={handleChange} className={inputClass} />
                </div>
                <div>
                  <label htmlFor="lastName" className={labelClass}>Last name</label>
                  <input id="lastName" name="lastName" type="text" required value={form.lastName} onChange={handleChange} className={inputClass} />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="email" className={labelClass}>Email</label>
                  <input id="email" name="email" type="email" required value={form.email} onChange={handleChange} className={inputClass} />
                  {!user && (
                    <p className="mt-1.5 text-xs text-slate-600">
                      Use the same email when you register or log in so you can view all details of your order later.
                    </p>
                  )}
                </div>
                <div className="sm:col-span-2 [&_.PhoneInput]:flex [&_.PhoneInput]:gap-2 [&_.PhoneInputInput]:flex-1 [&_.PhoneInputInput]:border-2 [&_.PhoneInputInput]:border-slate-200 [&_.PhoneInputInput]:rounded-xl [&_.PhoneInputInput]:px-4 [&_.PhoneInputInput]:py-3 [&_.PhoneInputInput]:focus:ring-2 [&_.PhoneInputInput]:focus:ring-[#BF0637]/30 [&_.PhoneInputInput]:focus:border-[#BF0637]">
                  <label className={labelClass}>Mobile number</label>
                  <PhoneInput
                    international
                    defaultCountry="US"
                    value={form.phone}
                    onChange={setPhone}
                    numberInputProps={{ className: "!rounded-xl", required: true }}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="line1" className={labelClass}>Address line 1</label>
                  <input id="line1" name="line1" type="text" required value={form.line1} onChange={handleChange} className={inputClass} />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="line2" className={labelClass}>Address line 2 (optional)</label>
                  <input id="line2" name="line2" type="text" value={form.line2} onChange={handleChange} className={inputClass} />
                </div>
                <div>
                  <label htmlFor="city" className={labelClass}>City</label>
                  <input id="city" name="city" type="text" required value={form.city} onChange={handleChange} className={inputClass} />
                </div>
                <div>
                  <label htmlFor="state" className={labelClass}>State / Province</label>
                  <input id="state" name="state" type="text" required value={form.state} onChange={handleChange} className={inputClass} />
                </div>
                <div>
                  <label htmlFor="postalCode" className={labelClass}>ZIP / Postal code</label>
                  <input id="postalCode" name="postalCode" type="text" required value={form.postalCode} onChange={handleChange} className={inputClass} />
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
            </section>

            <section className="bg-white/95 backdrop-blur-sm rounded-2xl border border-slate-200/80 shadow-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-200 flex items-center gap-2" style={{ background: "linear-gradient(to right, #fef2f2, #fff)" }}>
                <span className="w-7 h-7 rounded-lg bg-[#BF0637]/15 text-[#BF0637] flex items-center justify-center text-xs font-bold">2</span>
                <h2 className="text-base font-bold text-slate-900">Billing address</h2>
              </div>
              <div className="p-5 sm:p-6 space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={billingSameAsShipping}
                    onChange={(e) => setBillingSameAsShipping(e.target.checked)}
                    className="w-5 h-5 rounded border-2 border-slate-300 text-[#BF0637] focus:ring-[#BF0637]/30"
                  />
                  <span className="font-semibold text-slate-800">Use same address for billing</span>
                </label>
                {!billingSameAsShipping && (
                  <div className="pt-3 border-t border-slate-200 space-y-3">
                    <button type="button" onClick={() => setBillingAddress({ ...form })} className="text-sm font-semibold text-[#BF0637] hover:underline">
                      Copy from shipping address
                    </button>
                    <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="billFirstName" className={labelClass}>First name</label>
                      <input id="billFirstName" type="text" required value={billingAddress.firstName} onChange={(e) => setBillingAddress((p) => ({ ...p, firstName: e.target.value }))} className={inputClass} />
                    </div>
                    <div>
                      <label htmlFor="billLastName" className={labelClass}>Last name</label>
                      <input id="billLastName" type="text" required value={billingAddress.lastName} onChange={(e) => setBillingAddress((p) => ({ ...p, lastName: e.target.value }))} className={inputClass} />
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor="billLine1" className={labelClass}>Address line 1</label>
                      <input id="billLine1" type="text" required value={billingAddress.line1} onChange={(e) => setBillingAddress((p) => ({ ...p, line1: e.target.value }))} className={inputClass} />
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor="billLine2" className={labelClass}>Address line 2 (optional)</label>
                      <input id="billLine2" type="text" value={billingAddress.line2} onChange={(e) => setBillingAddress((p) => ({ ...p, line2: e.target.value }))} className={inputClass} />
                    </div>
                    <div>
                      <label htmlFor="billCity" className={labelClass}>City</label>
                      <input id="billCity" type="text" required value={billingAddress.city} onChange={(e) => setBillingAddress((p) => ({ ...p, city: e.target.value }))} className={inputClass} />
                    </div>
                    <div>
                      <label htmlFor="billState" className={labelClass}>State / Province</label>
                      <input id="billState" type="text" required value={billingAddress.state} onChange={(e) => setBillingAddress((p) => ({ ...p, state: e.target.value }))} className={inputClass} />
                    </div>
                    <div>
                      <label htmlFor="billPostalCode" className={labelClass}>ZIP / Postal code</label>
                      <input id="billPostalCode" type="text" required value={billingAddress.postalCode} onChange={(e) => setBillingAddress((p) => ({ ...p, postalCode: e.target.value }))} className={inputClass} />
                    </div>
                    <div>
                      <label htmlFor="billCountry" className={labelClass}>Country</label>
                      <select id="billCountry" value={billingAddress.country} onChange={(e) => setBillingAddress((p) => ({ ...p, country: e.target.value }))} className={inputClass}>
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
                )}
              </div>
            </section>

            <section className="bg-white/95 backdrop-blur-sm rounded-2xl border border-slate-200/80 shadow-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-200 flex items-center gap-2" style={{ background: "linear-gradient(to right, #fef2f2, #fff)" }}>
                <span className="w-7 h-7 rounded-lg bg-[#BF0637]/15 text-[#BF0637] flex items-center justify-center text-xs font-bold">3</span>
                <h2 className="text-base font-bold text-slate-900">Payment</h2>
              </div>
              <div className="p-5 sm:p-6">
                <p className="text-slate-600 text-sm">You will be redirected to Stripe to complete payment securely with your card.</p>
                <div className="mt-3 flex items-center gap-2 text-slate-600 text-sm">
                  <span className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                    <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
                    </svg>
                  </span>
                  <span className="font-medium">Secure payment by Stripe</span>
                </div>
              </div>
            </section>

            {error && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
                {error}
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-slate-200/80 shadow-xl overflow-hidden sticky top-24">
              <div className="px-5 py-4 border-b border-slate-200" style={{ background: "linear-gradient(to bottom, #f8fafc, #fff)" }}>
                <h2 className="text-base font-bold text-slate-900">Order summary</h2>
              </div>
              <div className="p-5 sm:p-6">
                <ul className="space-y-4 max-h-72 overflow-y-auto pr-1">
                  {items.map((item) => {
                    const key = getCartLineKey(item);
                    const lineTotal = item.product.price * item.quantity;
                    return (
                      <li key={key} className="flex gap-3 pb-4 border-b border-slate-200 last:border-0 last:pb-0">
                        <div className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                          {item.product.image ? (
                            <Image
                              src={item.product.image}
                              alt={item.product.name}
                              fill
                              className="object-cover"
                              unoptimized={item.product.image.startsWith("http")}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                              No image
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-slate-900 text-sm leading-tight">
                            {item.product.name}
                          </p>
                          <p className="text-slate-500 text-xs mt-0.5">
                            {item.quantity} × ${item.product.price.toFixed(2)} = ${lineTotal.toFixed(2)}
                          </p>
                          {(item.selectedSize || item.selectedColor) && (
                            <p className="text-slate-600 text-xs mt-1">
                              {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                              {item.selectedSize && item.selectedColor && " · "}
                              {item.selectedColor && <span>Color: {item.selectedColor}</span>}
                            </p>
                          )}
                          {item.product.description && (
                            <p className="text-slate-400 text-xs mt-1 line-clamp-2">
                              {item.product.description}
                            </p>
                          )}
                        </div>
                        <p className="text-[#BF0637] font-bold text-base shrink-0">
                          ${lineTotal.toFixed(2)}
                        </p>
                      </li>
                    );
                  })}
                </ul>
                <div className="mt-4 pt-4 border-t border-slate-200 space-y-2 text-sm">
                  <div className="flex justify-between text-slate-600 font-medium">
                    <span>Subtotal ({totalItems} items)</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 font-medium">
                    <span>Shipping</span>
                    <span>${SHIPPING_ESTIMATE.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-slate-900 pt-2">
                    <span>Total</span>
                    <span className="text-[#BF0637]">${total.toFixed(2)}</span>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-4 py-3 rounded-xl font-bold text-white text-sm shadow-lg shadow-[#BF0637]/20 disabled:opacity-70"
                  style={{ backgroundColor: "#BF0637" }}
                >
                  {loading ? "Redirecting…" : "Proceed to payment"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
