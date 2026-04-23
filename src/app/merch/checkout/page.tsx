"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import PhoneInput, { type Country } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { useMerchCart } from "@/context/MerchCartContext";
import type { PrintifyAddressTo } from "@/types/printify";
import { fullNameToFirstLast, type AppUser } from "@/types/user";
import { printifyCentsToDollars } from "@/lib/printify-money";
import { MerchAddressAutocomplete } from "@/components/merch/MerchAddressAutocomplete";

const SHIPPING_OPTIONS = [
  {
    value: 1,
    label: "Standard delivery",
    price: 6.99,
    eta: "5–8 business days",
    detail:
      "Ground service (USPS / UPS / equivalent). Reliable tracking once shipped. Best choice for most orders.",
  },
  {
    value: 2,
    label: "Priority",
    price: 11.99,
    eta: "3–5 business days",
    detail:
      "Faster fulfillment queue and expedited handoff to the carrier. Ideal when you need your merch sooner.",
  },
  {
    value: 3,
    label: "Express",
    price: 18.99,
    eta: "2–4 business days",
    detail:
      "Fastest option we offer at checkout. Rush processing plus premium shipping where available.",
  },
  {
    value: 4,
    label: "Economy",
    price: 4.49,
    eta: "8–12 business days",
    detail:
      "Lowest shipping rate. Slightly longer transit. Great for non-urgent orders and saving on delivery.",
  },
] as const;

const COUNTRY_CODES = [
  "US",
  "CA",
  "GB",
  "AU",
  "DE",
  "FR",
  "IN",
  "ES",
  "IT",
  "NL",
  "BE",
  "AT",
  "CH",
  "IE",
  "NZ",
  "JP",
  "MX",
  "BR",
  "SE",
  "DK",
  "NO",
  "FI",
  "PL",
  "PT",
  "GR",
  "KR",
] as const;

const initialAddress: PrintifyAddressTo = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  country: "US",
  region: "",
  address1: "",
  address2: "",
  city: "",
  zip: "",
};

const hasGooglePlaces = Boolean(
  typeof process !== "undefined" && process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.trim()
);
const CHECKOUT_GUEST_FLAG = "r3sults_checkout_guest";

function countryToPhoneCountry(c: string): Country {
  const set = new Set(COUNTRY_CODES);
  return (set.has(c as (typeof COUNTRY_CODES)[number]) ? c : "US") as Country;
}

/** Map profile country string to checkout ISO code */
function mapProfileCountryToCheckout(country: string): string {
  const raw = (country || "").trim();
  if (!raw) return "US";
  const upper = raw.toUpperCase().replace(/\s+/g, " ");
  if (COUNTRY_CODES.includes(upper as (typeof COUNTRY_CODES)[number])) return upper;
  const aliases: Record<string, string> = {
    INDIA: "IN",
    "UNITED STATES": "US",
    USA: "US",
    AMERICA: "US",
    UK: "GB",
    "UNITED KINGDOM": "GB",
    ENGLAND: "GB",
    CANADA: "CA",
    AUSTRALIA: "AU",
    GERMANY: "DE",
    FRANCE: "FR",
    SPAIN: "ES",
    ITALY: "IT",
    NETHERLANDS: "NL",
    BELGIUM: "BE",
    AUSTRIA: "AT",
    SWITZERLAND: "CH",
    IRELAND: "IE",
    "NEW ZEALAND": "NZ",
    JAPAN: "JP",
    MEXICO: "MX",
    BRAZIL: "BR",
    SWEDEN: "SE",
    DENMARK: "DK",
    NORWAY: "NO",
    FINLAND: "FI",
    POLAND: "PL",
    PORTUGAL: "PT",
    GREECE: "GR",
    "SOUTH KOREA": "KR",
    KOREA: "KR",
  };
  return aliases[upper] ?? (raw.length === 2 ? raw.toUpperCase() : "US");
}

function addressFromUser(user: AppUser): PrintifyAddressTo {
  const { firstName, lastName } = fullNameToFirstLast(user.fullName);
  const co = mapProfileCountryToCheckout(user.country);
  return {
    first_name: firstName,
    last_name: lastName,
    email: (user.email || "").trim(),
    phone: (user.phoneNumber || "").trim(),
    country: co,
    region: (user.state || "").trim(),
    address1: (user.address || "").trim(),
    address2: "",
    city: (user.city || "").trim(),
    zip: (user.pincode || "").trim(),
  };
}

export default function MerchCheckoutPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { items, updateQuantity, removeItem } = useMerchCart();
  const [address, setAddress] = useState<PrintifyAddressTo>(initialAddress);
  const [shippingMethod, setShippingMethod] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const merchPrefillFromUserDone = useRef(false);

  const shippingPrice = useMemo(() => {
    const o = SHIPPING_OPTIONS.find((x) => x.value === shippingMethod);
    return o?.price ?? SHIPPING_OPTIONS[0].price;
  }, [shippingMethod]);

  useEffect(() => {
    if (items.length === 0) {
      router.replace("/merch");
    }
  }, [items.length, router]);

  useEffect(() => {
    if (authLoading) return;
    if (user?.id) return;
    const hasGuestAccess =
      typeof window !== "undefined" && sessionStorage.getItem(CHECKOUT_GUEST_FLAG) === "1";
    if (!hasGuestAccess) {
      router.replace("/checkout-access?next=/merch/checkout");
    }
  }, [authLoading, user, router]);

  /** Pre-fill checkout from profile when logged in (once per visit) */
  useEffect(() => {
    if (authLoading) return;
    if (!user?.id) {
      merchPrefillFromUserDone.current = false;
      return;
    }
    if (merchPrefillFromUserDone.current) return;
    merchPrefillFromUserDone.current = true;
    const fromProfile = addressFromUser(user);
    setAddress((prev) => ({
      ...fromProfile,
      address2: prev.address2,
    }));
  }, [authLoading, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }
    const a = address;
    if (
      !a.first_name?.trim() ||
      !a.last_name?.trim() ||
      !a.email?.trim() ||
      !a.country?.trim() ||
      !a.address1?.trim() ||
      !a.city?.trim() ||
      !a.zip?.trim()
    ) {
      setError("Please fill in all required fields.");
      return;
    }
    for (const i of items) {
      if (i.price == null || !Number.isFinite(i.price) || i.price < 0) {
        setError("Some items are missing a price. Remove them and add again from the product page.");
        return;
      }
    }
    setLoading(true);
    try {
      const res = await fetch("/api/merch/stripe-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            product_id: i.product_id,
            variant_id: i.variant_id,
            quantity: i.quantity,
            product_title: i.product_title,
            variant_label: i.variant_label,
            image_url: i.image_url,
            price: Math.round(i.price!),
          })),
          address: {
            first_name: a.first_name.trim(),
            last_name: a.last_name.trim(),
            email: a.email.trim(),
            phone: a.phone?.trim() || undefined,
            country: a.country.trim(),
            region: a.region?.trim() || undefined,
            address1: a.address1.trim(),
            address2: a.address2?.trim() || undefined,
            city: a.city.trim(),
            zip: a.zip.trim(),
          },
          shipping_method: shippingMethod,
          shipping_usd: shippingPrice,
        }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        setError(data.error ?? "Could not start checkout. Is Stripe configured?");
        setLoading(false);
        return;
      }
      window.location.href = data.url;
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3 rounded-xl border border-slate-200/90 bg-white text-slate-900 placeholder:text-slate-400 shadow-sm transition-all duration-200 focus:border-[#BF0637] focus:ring-2 focus:ring-[#BF0637]/15 focus:outline-none";

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-28 flex items-center justify-center bg-[#faf8f5]">
        <p className="text-slate-500">Redirecting…</p>
      </div>
    );
  }

  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const subtotal = items.reduce((s, i) => {
    const d = i.price != null ? printifyCentsToDollars(i.price) : null;
    return s + (d != null ? d * i.quantity : 0);
  }, 0);
  const orderTotal = subtotal + shippingPrice;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#f7f4ef] via-[#fdfbf7] to-white">
      <div className="flex-1 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <Link
            href="/merch"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-[#BF0637] mb-8 transition-colors"
          >
            <span aria-hidden>←</span> Back to Merch
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#BF0637] mb-2">Checkout</p>
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">Almost there</h1>
              <p className="mt-2 text-slate-600 max-w-xl">
                {user?.id
                  ? "We’ve filled in your saved profile details — update anything before you pay."
                  : "Enter your shipping details."}
                {hasGooglePlaces ? " Full addresses appear as you type — tap one to auto-fill." : ""}
              </p>
            </div>
            <div className="text-sm text-slate-600 font-medium">
              {totalItems} item{totalItems !== 1 ? "s" : ""} · Est. total{" "}
              <span className="text-slate-900 font-bold tabular-nums">${orderTotal.toFixed(2)}</span>
              <span className="text-slate-400 text-xs block sm:inline sm:ml-1">incl. est. shipping · tax if applicable</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
            <div className="lg:col-span-7 space-y-8">
              <section className="rounded-3xl border border-stone-200/90 bg-white p-6 sm:p-8 shadow-[0_4px_40px_-12px_rgba(15,23,42,0.06)]">
                <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#BF0637]/10 text-sm font-bold text-[#BF0637]">
                    1
                  </span>
                  Contact &amp; shipping
                </h2>
                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                        First name *
                      </label>
                      <input
                        type="text"
                        required
                        value={address.first_name}
                        onChange={(e) => setAddress((a) => ({ ...a, first_name: e.target.value }))}
                        className={inputClass}
                        autoComplete="given-name"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                        Last name *
                      </label>
                      <input
                        type="text"
                        required
                        value={address.last_name}
                        onChange={(e) => setAddress((a) => ({ ...a, last_name: e.target.value }))}
                        className={inputClass}
                        autoComplete="family-name"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={address.email}
                      onChange={(e) => setAddress((a) => ({ ...a, email: e.target.value }))}
                      className={inputClass}
                      autoComplete="email"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                      Phone
                    </label>
                    <PhoneInput
                      international
                      defaultCountry={countryToPhoneCountry(address.country)}
                      country={countryToPhoneCountry(address.country)}
                      value={address.phone || undefined}
                      onChange={(v) => setAddress((a) => ({ ...a, phone: v ?? "" }))}
                      className="merch-checkout-phone"
                      placeholder="Phone number"
                    />
                  </div>

                  <div className="pt-2 border-t border-stone-100">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                      Street address *
                    </label>
                    {hasGooglePlaces && (
                      <p className="text-xs text-slate-500 mb-2">
                        Suggestions show the <strong>full address</strong>. Select one to fill city, state &amp; ZIP.
                      </p>
                    )}
                    <MerchAddressAutocomplete
                      value={address.address1}
                      onChange={(line1) => setAddress((a) => ({ ...a, address1: line1 }))}
                      onPlaceResolved={(patch) =>
                        setAddress((a) => ({
                          ...a,
                          ...patch,
                          country: COUNTRY_CODES.includes(patch.country as (typeof COUNTRY_CODES)[number])
                            ? patch.country!
                            : a.country,
                        }))
                      }
                      countryHint={address.country}
                      inputClassName={inputClass}
                      placeholder="Start typing your address…"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                      Apartment, suite (optional)
                    </label>
                    <input
                      type="text"
                      value={address.address2}
                      onChange={(e) => setAddress((a) => ({ ...a, address2: e.target.value }))}
                      className={inputClass}
                      autoComplete="address-line2"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        required
                        value={address.city}
                        onChange={(e) => setAddress((a) => ({ ...a, city: e.target.value }))}
                        className={inputClass}
                        autoComplete="address-level2"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                        State / Region
                      </label>
                      <input
                        type="text"
                        value={address.region}
                        onChange={(e) => setAddress((a) => ({ ...a, region: e.target.value }))}
                        className={inputClass}
                        autoComplete="address-level1"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                        ZIP / Postal *
                      </label>
                      <input
                        type="text"
                        required
                        value={address.zip}
                        onChange={(e) => setAddress((a) => ({ ...a, zip: e.target.value }))}
                        className={inputClass}
                        autoComplete="postal-code"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                        Country *
                      </label>
                      <select
                        required
                        value={address.country}
                        onChange={(e) => setAddress((a) => ({ ...a, country: e.target.value }))}
                        className={inputClass}
                        autoComplete="country"
                      >
                        {COUNTRY_CODES.map((c) => (
                          <option key={c} value={c}>
                            {c === "US"
                              ? "United States"
                              : c === "GB"
                                ? "United Kingdom"
                                : c === "CA"
                                  ? "Canada"
                                  : c}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </section>

              <section className="rounded-3xl border border-stone-200/90 bg-white p-6 sm:p-8 shadow-[0_4px_40px_-12px_rgba(15,23,42,0.06)]">
                <h2 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#BF0637]/10 text-sm font-bold text-[#BF0637]">
                    2
                  </span>
                  Shipping speed
                </h2>
                <p className="text-sm text-slate-500 mb-6 ml-10 sm:ml-10">
                  Estimated rates for your cart. Final carrier charges may vary slightly at fulfillment.
                </p>
                <div className="grid gap-3">
                  {SHIPPING_OPTIONS.map((opt) => (
                    <label
                      key={opt.value}
                      className={`flex flex-col sm:flex-row sm:items-stretch gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                        shippingMethod === opt.value
                          ? "border-[#BF0637] bg-[#BF0637]/[0.05] shadow-sm ring-1 ring-[#BF0637]/10"
                          : "border-stone-200 hover:border-stone-300 bg-[#fdfbf7]/80"
                      }`}
                    >
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <input
                          type="radio"
                          name="shipping"
                          value={opt.value}
                          checked={shippingMethod === opt.value}
                          onChange={() => setShippingMethod(opt.value)}
                          className="mt-1 h-4 w-4 text-[#BF0637] border-slate-300 focus:ring-[#BF0637] shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0">
                            <span className="font-bold text-slate-900">{opt.label}</span>
                            <span className="text-xs font-semibold uppercase tracking-wide text-[#BF0637]">
                              {opt.eta}
                            </span>
                          </div>
                          <p className="text-sm text-slate-600 mt-2 leading-relaxed">{opt.detail}</p>
                        </div>
                      </div>
                      <div className="shrink-0 flex sm:flex-col items-center sm:items-end justify-center sm:justify-start sm:min-w-[88px] pt-1 sm:pt-0 border-t sm:border-t-0 border-stone-100 sm:border-0">
                        <span className="text-lg font-bold text-slate-900 tabular-nums">
                          ${opt.price.toFixed(2)}
                        </span>
                        <span className="text-[10px] uppercase tracking-wider text-slate-400 sm:mt-0.5">
                          shipping
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </section>
            </div>

            <div className="lg:col-span-5">
              <div className="lg:sticky lg:top-28 space-y-6">
                <section className="rounded-3xl border border-stone-200/90 bg-[#fdfbf7] p-6 sm:p-8 shadow-[0_8px_40px_-16px_rgba(15,23,42,0.1)] ring-1 ring-stone-100">
                  <h2 className="text-lg font-bold text-slate-900 mb-1">Order summary</h2>
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-6">
                    Item prices excl. tax · shipping below
                  </p>
                  <ul className="space-y-4 max-h-[min(320px,42vh)] overflow-y-auto pr-1 -mr-1">
                    {items.map((item) => (
                      <li
                        key={`${item.product_id}-${item.variant_id}`}
                        className="flex gap-4 pb-4 border-b border-stone-200/80 last:border-0 last:pb-0"
                      >
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-white shrink-0 ring-1 ring-stone-200/80 shadow-sm">
                          {item.image_url ? (
                            <Image
                              src={item.image_url}
                              alt=""
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          ) : (
                            <div className="w-full h-full bg-stone-100" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-slate-900 leading-snug line-clamp-2 text-sm">
                            {item.product_title ?? "Product"}
                          </p>
                          {item.variant_label && (
                            <p className="text-xs text-slate-500 mt-1">{item.variant_label}</p>
                          )}
                          <div className="flex items-center gap-3 mt-2">
                            <span className="text-xs text-slate-500">Qty</span>
                            <input
                              type="number"
                              min={1}
                              max={99}
                              value={item.quantity}
                              onChange={(e) =>
                                updateQuantity(
                                  item.product_id,
                                  item.variant_id,
                                  Math.max(1, parseInt(e.target.value, 10) || 1)
                                )
                              }
                              className="w-14 px-2 py-1.5 rounded-lg bg-white border border-stone-200 text-slate-900 text-sm text-center"
                            />
                            <button
                              type="button"
                              onClick={() => removeItem(item.product_id, item.variant_id)}
                              className="text-xs font-semibold text-[#BF0637] hover:underline"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                        {item.price != null && printifyCentsToDollars(item.price) != null && (
                          <p className="text-sm font-bold text-slate-900 tabular-nums shrink-0">
                            ${(printifyCentsToDollars(item.price)! * item.quantity).toFixed(2)}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 pt-5 border-t border-stone-200/90 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Subtotal</span>
                      <span className="font-semibold text-slate-900 tabular-nums">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">
                        Shipping ({SHIPPING_OPTIONS.find((o) => o.value === shippingMethod)?.label ?? "—"})
                      </span>
                      <span className="font-semibold text-slate-900 tabular-nums">${shippingPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-baseline pt-3 border-t border-stone-200/90">
                      <span className="font-bold text-slate-900">Estimated total</span>
                      <span className="text-2xl font-bold text-[#BF0637] tabular-nums">${orderTotal.toFixed(2)}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Taxes (if any) and final shipping are confirmed when your print partner processes the order.
                    </p>
                  </div>
                </section>

                {error && (
                  <div
                    className="rounded-2xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-800"
                    role="alert"
                  >
                    {error}
                  </div>
                )}

                {!hasGooglePlaces && (
                  <p className="text-xs text-slate-500 text-center px-2">
                    Add <code className="bg-stone-100 px-1 rounded text-[11px]">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> for
                    address suggestions. See <code className="bg-stone-100 px-1 rounded text-[11px]">MERCH_GOOGLE_PLACES_SETUP.md</code>.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-2xl font-bold text-lg text-white bg-[#BF0637] hover:bg-[#a0052e] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-[#BF0637]/20 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                >
                  {loading ? "Redirecting to secure payment…" : `Pay · $${orderTotal.toFixed(2)}`}
                </button>
                <p className="text-center text-xs text-slate-400">
                  You&apos;ll complete payment on Stripe. Your print order is placed only after payment succeeds.
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}
