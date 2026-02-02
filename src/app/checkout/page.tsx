"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { useCart, getCartLineKey } from "@/context/CartContext";
import type { ShippingAddress } from "@/types/checkout";

const SHIPPING_ESTIMATE = 5.99;

export default function CheckoutPage() {
  const { items, totalItems } = useCart();
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

  useEffect(() => setMounted(true), []);

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
        body: JSON.stringify({ lineItems, shippingAddress: form }),
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

  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-500">Loading...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex flex-col items-center justify-center p-8">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-10 text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Your cart is empty</h1>
          <p className="text-slate-600 mb-8">Add items from the shop to checkout.</p>
          <Link
            href="/shop"
            className="inline-block px-8 py-3.5 rounded-xl font-semibold text-white shadow-lg shadow-[#BF0637]/25 hover:shadow-[#BF0637]/40 transition-shadow"
            style={{ backgroundColor: "#BF0637" }}
          >
            Continue shopping
          </Link>
        </div>
      </div>
    );
  }

  const inputClass = "w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-[#BF0637]/30 focus:border-[#BF0637] transition-colors";
  const labelClass = "block text-sm font-semibold text-slate-700 mb-1.5";

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-[#BF0637] font-medium mb-8 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to shop
        </Link>

        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">Checkout</h1>
          <p className="text-slate-600 mt-1">Complete your order securely</p>
        </div>

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8 lg:gap-10">
          {/* Left: Delivery & payment */}
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white rounded-2xl border-2 border-slate-200/80 shadow-xl shadow-slate-200/50 overflow-hidden">
              <div className="px-6 sm:px-8 py-5 bg-gradient-to-r from-slate-50 to-white border-b border-slate-200">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-[#BF0637]/10 text-[#BF0637] flex items-center justify-center text-sm font-extrabold">1</span>
                  Shipping address
                </h2>
              </div>
              <div className="p-6 sm:p-8 grid sm:grid-cols-2 gap-5">
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

            <section className="bg-white rounded-2xl border-2 border-slate-200/80 shadow-xl shadow-slate-200/50 overflow-hidden">
              <div className="px-6 sm:px-8 py-5 bg-gradient-to-r from-slate-50 to-white border-b border-slate-200">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-[#BF0637]/10 text-[#BF0637] flex items-center justify-center text-sm font-extrabold">2</span>
                  Payment
                </h2>
              </div>
              <div className="p-6 sm:p-8">
                <p className="text-slate-600">
                  You will be redirected to Stripe to complete payment securely with your card.
                </p>
                <div className="mt-4 flex items-center gap-3 text-slate-600">
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
              <div className="p-5 rounded-2xl bg-red-50 border-2 border-red-200 text-red-700 font-medium">
                {error}
              </div>
            )}
          </div>

          {/* Right: Order summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border-2 border-slate-200/80 shadow-xl shadow-slate-200/50 overflow-hidden sticky top-24">
              <div className="px-6 sm:px-6 py-5 bg-gradient-to-b from-slate-50 to-white border-b border-slate-200">
                <h2 className="text-xl font-bold text-slate-900">Order summary</h2>
              </div>
              <div className="p-6 sm:p-6">
                <ul className="space-y-5 max-h-80 overflow-y-auto pr-1">
                  {items.map((item) => {
                    const key = getCartLineKey(item);
                    const lineTotal = item.product.price * item.quantity;
                    return (
                      <li key={key} className="flex gap-4 pb-5 border-b border-slate-200 last:border-0 last:pb-0">
                        <div className="relative w-24 h-24 shrink-0 rounded-xl overflow-hidden bg-slate-100 border-2 border-slate-200">
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
                <div className="mt-6 pt-5 border-t-2 border-slate-200 space-y-3">
                  <div className="flex justify-between text-slate-600 font-medium">
                    <span>Subtotal ({totalItems} items)</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 font-medium">
                    <span>Shipping</span>
                    <span>${SHIPPING_ESTIMATE.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold text-slate-900 pt-3">
                    <span>Total</span>
                    <span className="text-[#BF0637]">${total.toFixed(2)}</span>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-6 py-4 rounded-xl font-bold text-white shadow-lg shadow-[#BF0637]/25 hover:shadow-[#BF0637]/40 transition-all disabled:opacity-70 disabled:shadow-none"
                  style={{ backgroundColor: "#BF0637" }}
                >
                  {loading ? "Redirecting to payment…" : "Proceed to payment"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
