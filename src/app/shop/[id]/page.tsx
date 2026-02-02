"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  extractProduct,
  extractProducts,
  normalizeProduct,
  type Product,
  type RawProduct,
} from "@/types/product";
import { useCart } from "@/context/CartContext";
import ProductMedia from "@/components/shop/ProductMedia";
import Footer from "@/components/Footer";

const COLOR_MAP: Record<string, string> = {
  black: "#1a1a1a",
  white: "#f5f5f5",
  blue: "#3b82f6",
  brown: "#92400e",
  red: "#dc2626",
  green: "#22c55e",
  pink: "#ec4899",
  orange: "#f97316",
  gold: "#eab308",
  grey: "#6b7280",
  gray: "#6b7280",
  navy: "#1e3a8a",
  cream: "#fef3c7",
  creamsicle: "#fed7aa",
  coral: "#fb7185",
  beige: "#d4b896",
  yellow: "#eab308",
  silver: "#9ca3af",
  lime: "#84cc16",
  "lime green": "#84cc16",
};

function getColorHex(name: string): string {
  const key = name.toLowerCase().replace(/\s+/g, "");
  return COLOR_MAP[key] ?? "#e2e8f0";
}

function formatDate(iso?: string): string {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  } catch {
    return iso;
  }
}

function Accordion({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-slate-200 last:border-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-left font-semibold text-slate-900 hover:text-[#BF0637] transition-colors"
      >
        <span>{title}</span>
        <span className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 text-lg leading-none shrink-0">
          {open ? "−" : "+"}
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          open ? "max-h-[1200px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="pb-4 text-slate-600 text-sm leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

function InfoRow({ label, value, unit }: { label: string; value?: React.ReactNode; unit?: string }) {
  if (value == null || value === "") return null;
  return (
    <div className="flex justify-between gap-4 py-2 border-b border-slate-100 last:border-0">
      <span className="text-slate-500 shrink-0">{label}</span>
      <span className="text-slate-900 text-right font-medium">
        {value}
        {unit && <span className="text-slate-500 font-normal"> {unit}</span>}
      </span>
    </div>
  );
}

export default function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [id, setId] = useState<string | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const relatedScrollRef = useRef<HTMLDivElement>(null);
  const { addItem, openCart } = useCart();

  useEffect(() => {
    params.then((p) => setId(p.id));
  }, [params]);

  useEffect(() => {
    if (!product?.id) return;
    let cancelled = false;
    fetch("/api/products?limit=20")
      .then((res) => res.ok ? res.json() : Promise.reject(new Error("Failed")))
      .then((data) => {
        if (cancelled) return;
        const list = extractProducts(data);
        const normalized = list.map((p: RawProduct) => normalizeProduct(p));
        const other = normalized.filter((p) => p.id !== product.id).slice(0, 8);
        setRelatedProducts(other);
      })
      .catch(() => setRelatedProducts([]));
    return () => { cancelled = true; };
  }, [product?.id]);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetch(`/api/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Product not found");
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        const raw = extractProduct(data);
        if (raw) setProduct(normalizeProduct(raw as RawProduct));
        else setError("Product not found");
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  const sizes: string[] = product?.size?.length
    ? product.size
    : [...new Set((product?.variants ?? []).map((v) => v.size).filter(Boolean) as string[])];
  const colors: string[] = product?.color?.length
    ? product.color
    : [...new Set((product?.variants ?? []).map((v) => v.color).filter(Boolean) as string[])];

  const available = (product?.stock?.availableQuantity ?? product?.stock?.quantity ?? 0) as number;
  const lowThresh = (product?.stock?.lowStockThreshold ?? 10) as number;
  const stockStatus = available === 0 ? "out" : available <= lowThresh ? "low" : "ok";
  const sizeRequired = sizes.length > 0;
  const colorRequired = colors.length > 0;
  const optionsRequired = sizeRequired || colorRequired;
  const hasSelectedOptions = (!sizeRequired || !!selectedSize) && (!colorRequired || !!selectedColor);
  const canAdd = available > 0 && hasSelectedOptions;
  const addButtonMessage = !canAdd && available > 0 && optionsRequired
    ? (sizeRequired && colorRequired && !selectedSize && !selectedColor
        ? "Please select size and colour"
        : sizeRequired && !selectedSize
          ? "Please select size"
          : colorRequired && !selectedColor
            ? "Please select colour"
            : "Please select options")
    : !canAdd && available === 0
      ? "Out of stock"
      : "Add to cart";

  const handleAddToCart = useCallback(() => {
    if (!product || !canAdd) return;
    addItem(product, quantity, {
      size: selectedSize || undefined,
      color: selectedColor || undefined,
    });
    openCart();
  }, [product, quantity, selectedSize, selectedColor, canAdd, addItem, openCart]);

  if (loading) {
    return (
      <div className="min-h-screen pt-28 pb-16 flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-[#BF0637] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen pt-28 pb-16 flex flex-col items-center justify-center gap-4">
        <p className="text-red-600 font-medium">{error ?? "Product not found"}</p>
        <Link href="/shop" className="text-[#BF0637] font-medium hover:underline">
          ← Back to shop
        </Link>
      </div>
    );
  }

  const images = product.images ?? (product.image ? [{ url: product.image, alt: product.name }] : []);
  const ship = product.shippingInfo && typeof product.shippingInfo === "object" ? product.shippingInfo as Record<string, unknown> : undefined;

  return (
    <div className="min-h-screen pt-28 pb-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="mb-6 text-sm text-slate-500 animate-[fadeIn_0.4s_ease-out]">
          <Link href="/" className="hover:text-slate-700">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/shop" className="hover:text-slate-700">Shop</Link>
          <span className="mx-2">/</span>
          <span className="text-slate-900 truncate">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
          <div className="lg:sticky lg:top-28 lg:self-start animate-[fadeIn_0.5s_ease-out]">
            <ProductMedia
              images={images}
              primaryImage={product.image}
              videoUrl={product.videoUrl}
              model3dUrl={product.model3dUrl}
              productName={product.name}
            />
          </div>

          <div className="space-y-6 animate-[fadeIn_0.5s_ease-out_0.1s_both]">
            {/* Subheading first: category · subcategory, featured, warranty */}
            <div className="flex flex-wrap items-center gap-2">
              {(product.category || product.subcategory) && (
                <span className="text-xs font-semibold text-[#BF0637] uppercase tracking-wider">
                  {[product.category, product.subcategory].filter(Boolean).join(" · ")}
                </span>
              )}
              {product.isFeatured && (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold">
                  Featured
                </span>
              )}
              {product.warrantyPeriod != null && product.warrantyPeriod > 0 && (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
                  {product.warrantyPeriod} {product.warrantyPeriod === 1 ? "month" : "months"} warranty
                </span>
              )}
            </div>

            {/* Product details section below subheading – material, weight, dimensions, tags inside */}
            {(product.material || product.weight != null || product.dimensions || (product.tags && product.tags.length > 0)) && (
              <div className="rounded-xl border-2 border-slate-200 bg-slate-50/50 p-3 sm:p-4">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Product details</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                  {product.material && (
                    <span className="text-slate-700"><strong className="text-slate-900">Material:</strong> {product.material}</span>
                  )}
                  {product.weight != null && (
                    <span className="text-slate-700"><strong className="text-slate-900">Weight:</strong> {product.weight} kg</span>
                  )}
                  {product.dimensions && (
                    <span className="text-slate-700">
                      <strong className="text-slate-900">Dimensions:</strong>{" "}
                      L {product.dimensions.length ?? "—"} × W {product.dimensions.width ?? "—"} × H {product.dimensions.height ?? "—"} cm
                    </span>
                  )}
                </div>
                {product.tags && product.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2 pt-2 border-t border-slate-200">
                    {product.tags.map((t, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center px-2.5 py-1 rounded-md bg-[#BF0637]/10 text-[#BF0637] text-xs font-semibold border border-[#BF0637]/20"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Product name with stock / options tag */}
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight flex-1 min-w-0">
                {product.name}
              </h1>
              <div className="shrink-0 flex items-center">
                {stockStatus === "ok" && !optionsRequired && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-sm font-medium border border-emerald-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" /> In stock
                  </span>
                )}
                {stockStatus === "ok" && optionsRequired && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-sm font-medium border border-blue-200">
                    <span className="w-2 h-2 rounded-full bg-blue-500" /> In stock — Select options
                  </span>
                )}
                {stockStatus === "low" && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 text-amber-700 text-sm font-medium border border-amber-200">
                    <span className="w-2 h-2 rounded-full bg-amber-500" /> Low stock
                  </span>
                )}
                {stockStatus === "out" && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-sm font-medium border border-slate-200">
                    Out of stock
                  </span>
                )}
              </div>
            </div>

            {product.description && (
              <p className="text-slate-600 leading-relaxed">{product.description}</p>
            )}

            {/* Price block */}
            <div className="flex flex-wrap items-baseline gap-3">
              <span className="text-2xl font-bold text-slate-900">
                ${product.price.toFixed(2)}
              </span>
              {product.costPrice != null && product.costPrice > product.price && (
                <span className="text-slate-400 line-through text-lg">
                  ${product.costPrice.toFixed(2)}
                </span>
              )}
              {product.discount != null && product.discount > 0 && (
                <span className="px-2 py-0.5 rounded bg-red-100 text-[#BF0637] font-semibold text-sm">
                  {product.discount}% off
                </span>
              )}
              {product.taxRate != null && product.taxRate > 0 && (
                <span className="text-slate-500 text-sm">+ {product.taxRate}% tax</span>
              )}
            </div>

            {/* Quick info: Brand, Model, SKU, Barcode */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-sm">
              {product.brand && <InfoRow label="Brand" value={product.brand} />}
              {product.model && <InfoRow label="Model" value={product.model} />}
              {product.sku && <InfoRow label="SKU" value={product.sku} />}
              {product.barcode && <InfoRow label="Barcode" value={product.barcode} />}
            </div>

            {/* Colour */}
            {colors.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-slate-900 mb-2">
                  Colour <span className="text-slate-500 font-normal">(required)</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {colors.map((c) => {
                    const hex = getColorHex(c);
                    const isColorLike = /^[a-zA-Z\s]+$/.test(c) && hex !== "#e2e8f0";
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setSelectedColor(c)}
                        title={c}
                        className={`w-10 h-10 rounded-xl border-2 transition-all shrink-0 ${
                          selectedColor === c
                            ? "border-[#BF0637] ring-2 ring-[#BF0637]/30"
                            : "border-slate-200 hover:border-slate-400"
                        } ${isColorLike ? "" : "bg-slate-100 flex items-center justify-center"}`}
                        style={isColorLike ? { backgroundColor: hex } : undefined}
                      >
                        {!isColorLike && <span className="text-xs font-medium text-slate-600 truncate px-1">{c}</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Size */}
            {sizes.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-slate-900 mb-2">
                  Size <span className="text-slate-500 font-normal">(required)</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSelectedSize(s)}
                      className={`min-w-[44px] px-4 py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${
                        selectedSize === s
                          ? "border-[#BF0637] bg-[#BF0637]/10 text-[#BF0637]"
                          : "border-slate-200 text-slate-700 hover:border-slate-400"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity + Add to cart */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-end gap-4">
                <div>
                  <p className="text-sm font-semibold text-slate-900 mb-1">Quantity</p>
                  <div className="flex items-center border-2 border-slate-200 rounded-xl overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-11 h-11 flex items-center justify-center bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors"
                    >
                      −
                    </button>
                    <span className="w-12 text-center font-semibold">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.min(available, q + 1))}
                      className="w-11 h-11 flex items-center justify-center bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="flex-1 min-w-[200px]">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={!canAdd}
                    className={`w-full py-4 px-6 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl disabled:cursor-not-allowed ${
                      canAdd
                        ? "text-white hover:opacity-90"
                        : available > 0 && optionsRequired
                          ? "bg-slate-200 text-slate-600 cursor-not-allowed"
                          : "bg-slate-200 text-slate-500 cursor-not-allowed"
                    }`}
                    style={canAdd ? { backgroundColor: "#BF0637" } : undefined}
                  >
                    {addButtonMessage}
                  </button>
                  {!canAdd && available > 0 && optionsRequired && (
                    <p className="mt-2 text-sm text-amber-600 font-medium">
                      Please select {sizeRequired && colorRequired ? "size and colour" : sizeRequired ? "size" : "colour"} above to add this item to your cart.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Accordions – all product info */}
            <div className="pt-4 border-t border-slate-200">
              <Accordion title="Product details" defaultOpen={!!(product.material || product.weight || product.dimensions)}>
                <div className="space-y-0">
                  <InfoRow label="Material" value={product.material} />
                  <InfoRow label="Weight" value={product.weight} unit="kg" />
                  {product.dimensions && (
                    <InfoRow
                      label="Dimensions"
                      value={`L ${product.dimensions.length ?? "—"} × W ${product.dimensions.width ?? "—"} × H ${product.dimensions.height ?? "—"} cm`}
                    />
                  )}
                  {!product.material && product.weight == null && !product.dimensions && (
                    <p className="text-slate-500">See description for details.</p>
                  )}
                </div>
              </Accordion>

              {((product.safetyFeatures?.length ?? 0) + (product.safetyStandards?.length ?? 0) + (product.certifications?.length ?? 0)) > 0 && (
                <Accordion title="Safety & compliance" defaultOpen={false}>
                  <div className="space-y-3">
                    {product.safetyFeatures && product.safetyFeatures.length > 0 && (
                      <div>
                        <p className="font-medium text-slate-800 mb-1">Safety features</p>
                        <ul className="list-disc list-inside text-slate-600 space-y-0.5">
                          {product.safetyFeatures.map((f, i) => (
                            <li key={i}>{f}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {product.safetyStandards && product.safetyStandards.length > 0 && (
                      <div>
                        <p className="font-medium text-slate-800 mb-1">Standards</p>
                        <ul className="list-disc list-inside text-slate-600 space-y-0.5">
                          {product.safetyStandards.map((s, i) => (
                            <li key={i}>{s}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {product.certifications && product.certifications.length > 0 && (
                      <div>
                        <p className="font-medium text-slate-800 mb-1">Certifications</p>
                        <div className="flex flex-wrap gap-2">
                          {product.certifications.map((c, i) => (
                            <span key={i} className="px-2 py-1 rounded bg-slate-100 text-slate-700 text-sm">
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </Accordion>
              )}

              {product.keyFeatures && product.keyFeatures.length > 0 && (
                <Accordion title="Key features" defaultOpen={true}>
                  <ul className="list-disc list-inside text-slate-600 space-y-1">
                    {product.keyFeatures.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                </Accordion>
              )}

              {product.specifications && product.specifications.length > 0 && (
                <Accordion title="Specifications" defaultOpen={false}>
                  <div className="space-y-0">
                    {product.specifications.map((s, i) => (
                      <InfoRow key={i} label={s.key ?? "—"} value={s.value} />
                    ))}
                  </div>
                </Accordion>
              )}

              {product.vendor && (product.vendor.name || product.vendor.contact || product.vendor.email) && (
                <Accordion title="Vendor & support" defaultOpen={false}>
                  <div className="space-y-0">
                    <InfoRow label="Vendor" value={product.vendor.name} />
                    <InfoRow label="Contact" value={product.vendor.contact} />
                    <InfoRow label="Email" value={product.vendor.email} />
                    <InfoRow label="Address" value={product.vendor.address} />
                  </div>
                </Accordion>
              )}

              <Accordion title="Shipping & returns" defaultOpen={!!(product.returnPolicy || product.warrantyPeriod || ship)}>
                <div className="space-y-3">
                  {product.returnPolicy && (
                    <div>
                      <p className="font-medium text-slate-800 mb-1">Returns</p>
                      <p className="text-slate-600">{product.returnPolicy}</p>
                    </div>
                  )}
                  {product.warrantyPeriod != null && (
                    <p className="text-slate-600"><strong className="text-slate-800">Warranty:</strong> {product.warrantyPeriod} months</p>
                  )}
                  {ship && (
                    <div className="space-y-0">
                      {ship.weight != null && <InfoRow label="Ship weight" value={String(ship.weight)} unit="kg" />}
                      {ship.dimensions != null && <InfoRow label="Ship dimensions" value={typeof ship.dimensions === "object" ? JSON.stringify(ship.dimensions) : String(ship.dimensions)} />}
                      {ship.shippingClass != null && <InfoRow label="Shipping class" value={String(ship.shippingClass) as React.ReactNode} />}
                    </div>
                  )}
                  {!product.returnPolicy && !product.warrantyPeriod && !ship && (
                    <p className="text-slate-500">Standard shipping available. Contact us for delivery details.</p>
                  )}
                </div>
              </Accordion>

              <Accordion title="Product info" defaultOpen={false}>
                <div className="space-y-0">
                  <InfoRow label="Status" value={product.status} />
                  {(product.createdAt || product.updatedAt) && (
                    <div className="pt-2 space-y-0">
                      {product.createdAt && <InfoRow label="Added" value={formatDate(product.createdAt)} />}
                      {product.updatedAt && <InfoRow label="Updated" value={formatDate(product.updatedAt)} />}
                    </div>
                  )}
                </div>
              </Accordion>
            </div>
          </div>
        </div>

        {/* Related products – carousel with minimalistic cards */}
        {relatedProducts.length > 0 && (
          <section className="mt-16 pt-12 border-t border-slate-200 animate-[fadeIn_0.5s_ease-out]">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Related products</h2>
                <p className="text-sm text-slate-500 mt-0.5">Free delivery on eligible orders</p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => relatedScrollRef.current?.scrollBy({ left: -320, behavior: "smooth" })}
                  className="w-10 h-10 rounded-lg border border-slate-300 bg-white flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:border-slate-400 transition-colors"
                  aria-label="Previous"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <button
                  type="button"
                  onClick={() => relatedScrollRef.current?.scrollBy({ left: 320, behavior: "smooth" })}
                  className="w-10 h-10 rounded-lg border border-slate-300 bg-white flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:border-slate-400 transition-colors"
                  aria-label="Next"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>
            </div>
            <div
              ref={relatedScrollRef}
              className="flex gap-4 overflow-x-auto pb-2 -mx-1 scroll-smooth snap-x snap-mandatory"
            >
              {relatedProducts.map((p, i) => {
                const avail = (p.stock?.availableQuantity ?? p.stock?.quantity ?? 0) as number;
                const inStock = avail > 0;
                return (
                  <Link
                    key={p.id}
                    href={`/shop/${p.id}`}
                    className="group shrink-0 w-[220px] sm:w-[260px] rounded-xl border-2 border-slate-200 bg-white overflow-hidden hover:border-slate-300 hover:shadow-lg transition-all duration-300 snap-start"
                    style={{
                      animation: "shopCardFadeIn 0.4s ease-out forwards",
                      animationDelay: `${i * 50}ms`,
                      opacity: 0,
                    }}
                  >
                    <div className="relative aspect-square bg-slate-50 overflow-hidden">
                      {p.image && (
                        <Image
                          src={p.image}
                          alt={p.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="260px"
                          unoptimized={p.image.startsWith("http")}
                        />
                      )}
                      <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                        {p.discount != null && p.discount > 0 && (
                          <span className="px-2 py-0.5 rounded bg-[#BF0637] text-white text-xs font-semibold">
                            -{p.discount}%
                          </span>
                        )}
                        {p.isFeatured && (
                          <span className="px-2 py-0.5 rounded bg-amber-500 text-white text-xs font-semibold">
                            #1 Best Seller
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium text-slate-900 text-sm line-clamp-2 group-hover:text-[#BF0637] transition-colors">
                        {p.name}
                      </h3>
                      <div className="mt-2 flex flex-wrap items-baseline gap-2">
                        <span className="text-base font-bold text-slate-900">
                          ${p.price.toFixed(2)}
                        </span>
                        {p.costPrice != null && p.costPrice > p.price && (
                          <span className="text-slate-400 line-through text-sm">
                            M.R.P: ${p.costPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <div className="mt-1.5 flex items-center gap-2 text-xs">
                        {inStock ? (
                          <span className="text-emerald-600 font-medium">In stock</span>
                        ) : (
                          <span className="text-slate-500">Out of stock</span>
                        )}
                        <span className="text-sky-600 font-medium">Free delivery</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </div>
      <Footer />
    </div>
  );
}
