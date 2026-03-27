"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { useMerchCart } from "@/context/MerchCartContext";
import type { Product } from "@/types/product";
import type { PrintifyLineItem, PrintifyProduct, PrintifyVariant, PrintifyOption } from "@/types/printify";
import { formatPrintifyUsd, printifyCentsToDollars } from "@/lib/printify-money";
import { MerchProductImageGallery } from "@/components/merch/MerchProductImageGallery";
import { OptionPickerBlock } from "@/components/merch/MerchOptionPickers";

function getImageUrl(img: { src?: string; url?: string } | undefined): string {
  if (!img) return "";
  return img.src ?? img.url ?? "";
}

function getAllImageUrls(product: PrintifyProduct): string[] {
  const urls: string[] = [];
  const seen = new Set<string>();
  (product.images ?? []).forEach((img) => {
    const u = getImageUrl(img);
    if (u && !seen.has(u)) {
      seen.add(u);
      urls.push(u);
    }
  });
  (product.views ?? []).forEach((view) => {
    (view.files ?? []).forEach((f) => {
      const u = f.src ?? f.url ?? "";
      if (u && !seen.has(u)) {
        seen.add(u);
        urls.push(u);
      }
    });
  });
  return urls;
}

function findVariant(
  variants: PrintifyVariant[] | undefined,
  options: PrintifyOption[],
  selectedOptions: Record<string, number>
): PrintifyVariant | null {
  if (!variants?.length || !options.length) return null;
  for (const v of variants) {
    const opts = v.options ?? {};
    let match = true;
    for (const o of options) {
      const selectedId = selectedOptions[o.name];
      if (selectedId == null) {
        match = false;
        break;
      }
      const variantValue =
        opts[o.name] ??
        opts[o.name.toLowerCase()] ??
        opts[o.name.toUpperCase()] ??
        Object.entries(opts).find(([, val]) => val === selectedId)?.[1];
      if (variantValue !== selectedId) {
        match = false;
        break;
      }
    }
    if (match) return v;
  }
  return null;
}

function ProductDescription({ html }: { html: string }) {
  if (!html?.trim()) return null;
  return (
    <div
      className="merch-description merch-description-prose text-slate-700"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

function getProductTags(product: PrintifyProduct): string[] {
  const t = product.tags;
  if (Array.isArray(t)) return t.map(String).filter(Boolean);
  if (typeof t === "string")
    return t
      .split(/[,;]/)
      .map((s) => s.trim())
      .filter(Boolean);
  return [];
}

type DetailTab = "description" | "details" | "variants";

function formatGrams(g: unknown): string {
  if (g == null || g === "") return "—";
  const n = Number(g);
  if (!Number.isFinite(n)) return "—";
  if (n >= 1000) return `${(n / 1000).toFixed(2)} kg`;
  return `${Math.round(n)} g`;
}

function formatApiValue(v: unknown): string {
  if (v == null) return "";
  if (typeof v === "boolean") return v ? "Yes" : "No";
  if (typeof v === "number") return String(v);
  if (typeof v === "string") {
    if (/^\d{4}-\d{2}-\d{2}/.test(v)) {
      try {
        return new Date(v).toLocaleString(undefined, {
          dateStyle: "medium",
          timeStyle: "short",
        });
      } catch {
        return v;
      }
    }
    return v;
  }
  if (Array.isArray(v)) return v.length ? v.join(", ") : "";
  return JSON.stringify(v).slice(0, 160);
}

export default function MerchProductPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const productId = params.productId as string;
  const shopId = searchParams.get("shop_id") ?? process.env.NEXT_PUBLIC_PRINTIFY_SHOP_ID ?? "";
  const { addItem: addCartItem, openCart } = useCart();
  const { addItem: addMerchItem } = useMerchCart();

  const [product, setProduct] = useState<PrintifyProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, number>>({});
  const [quantity, setQuantity] = useState(1);
  const [detailTab, setDetailTab] = useState<DetailTab>("description");
  const [tagsExpanded, setTagsExpanded] = useState(false);

  const imageUrls = useMemo(() => (product ? getAllImageUrls(product) : []), [product]);
  const mainImageUrl = imageUrls[0] ?? "";

  useEffect(() => {
    let sid = shopId;
    const fetchProduct = (id: string) =>
      fetch(`/api/printify/products/${productId}?shop_id=${id}`).then((r) => r.json());

    if (!sid) {
      fetch("/api/printify/shops")
        .then((r) => r.json())
        .then((d) => {
          const shops = d.data?.shops ?? [];
          return shops[0]?.id != null ? String(shops[0].id) : "";
        })
        .then((id) => {
          sid = id;
          if (!sid) {
            setError("No shop configured");
            setLoading(false);
            return;
          }
          return fetchProduct(sid);
        })
        .then((data) => {
          if (data?.success && data.data) {
            const p = data.data as PrintifyProduct;
            setProduct(p);
            const opts = (p.options ?? []) as PrintifyOption[];
            const initial: Record<string, number> = {};
            opts.forEach((o) => {
              const first = o.values?.[0];
              if (first) initial[o.name] = first.id;
            });
            setSelectedOptions(initial);
          } else {
            setError(data?.error ?? "Product not found");
          }
        })
        .catch(() => setError("Failed to load product"))
        .finally(() => setLoading(false));
      return;
    }
    fetchProduct(sid)
      .then((data) => {
        if (data?.success && data.data) {
          const p = data.data as PrintifyProduct;
          setProduct(p);
          const opts = (p.options ?? []) as PrintifyOption[];
          const initial: Record<string, number> = {};
          opts.forEach((o) => {
            const first = o.values?.[0];
            if (first) initial[o.name] = first.id;
          });
          setSelectedOptions(initial);
        } else {
          setError(data?.error ?? "Product not found");
        }
      })
      .catch(() => setError("Failed to load product"))
      .finally(() => setLoading(false));
  }, [productId, shopId]);

  const options = (product?.options ?? []) as PrintifyOption[];
  const variant = useMemo(
    () => (product ? findVariant(product.variants, options, selectedOptions) : null),
    [product, options, selectedOptions]
  );
  const canAdd = variant && variant.is_available !== false;

  const specRows = useMemo(() => {
    if (!product) return [];
    const p = product as Record<string, unknown>;
    const rows: { label: string; value: string }[] = [];

    const add = (label: string, key: string) => {
      const v = p[key];
      if (v === undefined || v === null || v === "") return;
      const s = formatApiValue(v);
      if (s) rows.push({ label, value: s });
    };

    add("Product ID", "id");
    add("Blueprint ID", "blueprint_id");
    add("Print provider ID", "print_provider_id");
    add("Created", "created_at");
    add("Updated", "updated_at");
    if (p.visible !== undefined || p.is_visible !== undefined) {
      rows.push({
        label: "Visible in catalog",
        value: formatApiValue(p.visible ?? p.is_visible),
      });
    }
    add("Locked", "is_locked");
    add("Printify Express", "is_printify_express");
    add("Shipping template", "shipping_template");

    const sc = p.sales_channel_properties;
    if (sc && typeof sc === "object") {
      rows.push({
        label: "Sales channels",
        value: Object.entries(sc as Record<string, unknown>)
          .map(([k, v]) => `${k}: ${formatApiValue(v)}`)
          .join(" · "),
      });
    }

    if (product.variants?.length)
      rows.push({
        label: "Total variants",
        value: String(product.variants.length),
      });
    options.forEach((o) => {
      const n = o.values?.length ?? 0;
      if (n) rows.push({ label: `${o.name} options`, value: String(n) });
    });

    const viewCount = (product.views ?? []).reduce((n, v) => n + (v.files?.length ?? 0), 0);
    if (viewCount)
      rows.push({ label: "Gallery images", value: String(imageUrls.length) });

    add("External ID", "external_id");
    add("User ID", "user_id");
    add("Deleted", "is_deleted");
    add("Integration", "integration");
    if (p.decoration_methods && Array.isArray(p.decoration_methods)) {
      rows.push({
        label: "Decoration methods",
        value: (p.decoration_methods as unknown[]).map(String).join(", "),
      });
    }

    return rows;
  }, [product, options, imageUrls.length]);

  const tags = product ? getProductTags(product) : [];
  const TAG_PREVIEW = 6;

  const extraApiFields = useMemo(() => {
    if (!product) return [] as { key: string; value: string }[];
    const p = product as Record<string, unknown>;
    const skip = new Set([
      "id",
      "title",
      "description",
      "images",
      "views",
      "variants",
      "options",
      "tags",
      "blueprint_id",
      "print_provider_id",
      "created_at",
      "updated_at",
      "visible",
      "is_visible",
      "is_locked",
      "is_printify_express",
      "shipping_template",
      "sales_channel_properties",
      "external_id",
      "user_id",
      "is_deleted",
      "integration",
      "decoration_methods",
    ]);
    const out: { key: string; value: string }[] = [];
    for (const [key, val] of Object.entries(p)) {
      if (skip.has(key) || val == null || val === "") continue;
      if (typeof val === "object") {
        try {
          const s = JSON.stringify(val);
          if (s.length > 2 && s.length < 500) out.push({ key, value: s });
        } catch {
          /* ignore */
        }
        continue;
      }
      out.push({ key, value: formatApiValue(val) });
    }
    return out.sort((a, b) => a.key.localeCompare(b.key));
  }, [product]);

  const handleAddToCart = (goToCheckout = false) => {
    if (!variant || !product) return;
    const optionTitles = options
      .map((o) => {
        const val = o.values?.find((v) => v.id === selectedOptions[o.name]);
        return { option: o.name, title: val?.title };
      })
      .filter((x) => !!x.title) as Array<{ option: string; title: string }>;
    const selectedSize =
      optionTitles.find((x) => x.option.toLowerCase().includes("size"))?.title ?? undefined;
    const selectedColor =
      optionTitles.find((x) => /colou?r/i.test(x.option))?.title ?? undefined;
    const priceDollars = printifyCentsToDollars(variant.price ?? variant.cost ?? null) ?? 0;
    const image = mainImageUrl || getImageUrl(product.images?.[0]);
    const cartProduct: Product = {
      id: `merch:${product.id}:${variant.id}`,
      name: product.title ?? "Merchandise item",
      description: product.description ?? undefined,
      price: priceDollars,
      image: image || "",
      images: image ? [{ url: image }] : undefined,
      category: "Merchandise",
      brand: "R3sults",
      sku: String(variant.id),
    };

    const result = addCartItem(cartProduct, quantity, {
      size: selectedSize,
      color: selectedColor,
    });
    if (!result.ok) {
      window.alert(result.error);
      return;
    }
    const merchItem: PrintifyLineItem = {
      product_id: product.id,
      variant_id: variant.id,
      quantity,
      product_title: product.title,
      variant_label:
        options
          .map((o) => {
            const val = o.values?.find((v) => v.id === selectedOptions[o.name]);
            return val?.title;
          })
          .filter(Boolean)
          .join(" / ") || `Variant ${variant.id}`,
      image_url: image || undefined,
      price: variant.price ?? variant.cost,
    };
    addMerchItem(merchItem);
    if (goToCheckout) {
      router.push("/merch/checkout");
      return;
    }
    openCart();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50/80">
        <div className="flex-1 pt-28 pb-16 px-4 sm:px-6 max-w-7xl mx-auto w-full">
          <div className="h-4 w-32 bg-slate-200 rounded-lg animate-pulse mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
            <div className="space-y-3">
              <div className="aspect-square bg-gradient-to-br from-slate-200 to-slate-100 rounded-2xl animate-pulse" />
              <div className="flex gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-16 h-16 bg-slate-200 rounded-xl animate-pulse" />
                ))}
              </div>
            </div>
            <div className="space-y-5">
              <div className="h-9 bg-slate-200 rounded-xl w-4/5 animate-pulse" />
              <div className="h-8 bg-slate-200 rounded-lg w-1/3 animate-pulse" />
              <div className="h-24 bg-slate-200 rounded-2xl animate-pulse" />
              <div className="h-24 bg-slate-200 rounded-2xl animate-pulse" />
              <div className="h-12 bg-slate-200 rounded-full w-40 animate-pulse" />
              <div className="flex gap-3 pt-4">
                <div className="h-12 flex-1 bg-slate-300 rounded-xl animate-pulse max-w-[200px]" />
                <div className="h-12 flex-1 bg-slate-200 rounded-xl animate-pulse max-w-[200px]" />
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen pt-24 px-4 bg-slate-50">
        <div className="max-w-2xl mx-auto rounded-2xl bg-red-50 border border-red-200 px-6 py-8 text-red-800">
          {error ?? "Product not found"}
          <Link href="/merch" className="block mt-6 font-semibold text-[#BF0637] hover:underline">
            ← Back to Merch
          </Link>
        </div>
      </div>
    );
  }

  const vRecord = variant as Record<string, unknown> | null;
  const variantSku =
    variant && typeof vRecord?.sku === "string" ? (vRecord.sku as string) : null;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white">
      <div className="flex-1 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto merch-product-enter">
          <Link
            href="/merch"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-[#BF0637] mb-8 transition-colors duration-200"
          >
            <span className="text-lg leading-none">←</span> Back to Merch
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16 items-start">
            <div className="min-w-0">
              <MerchProductImageGallery urls={imageUrls} title={product.title ?? "Product"} />
            </div>

            <div className="min-w-0 space-y-6 lg:sticky lg:top-28">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight leading-tight">
                {product.title}
              </h1>

              {tags.length > 0 && (
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2 items-center">
                    {(tagsExpanded ? tags : tags.slice(0, TAG_PREVIEW)).map((t) => (
                      <span
                        key={t}
                        className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200/80"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  {tags.length > TAG_PREVIEW && (
                    <button
                      type="button"
                      onClick={() => setTagsExpanded((e) => !e)}
                      className="text-xs font-semibold text-[#BF0637] hover:underline"
                    >
                      {tagsExpanded ? "Show fewer tags" : `Show all ${tags.length} tags`}
                    </button>
                  )}
                </div>
              )}

              {variant && (
                <div className="flex flex-wrap items-end gap-3">
                  <p className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
                    {variant.price != null
                      ? formatPrintifyUsd(variant.price)
                      : variant.cost != null
                        ? formatPrintifyUsd(variant.cost)
                        : "—"}
                  </p>
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 pb-1.5">
                    Excl. tax &amp; shipping
                  </span>
                </div>
              )}

              {variantSku && (
                <p className="text-sm text-slate-500">
                  SKU:{" "}
                  <code className="text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md text-xs font-mono">
                    {variantSku}
                  </code>
                </p>
              )}

              <div className="space-y-4 pt-2">
                {options.map((opt) => (
                  <OptionPickerBlock
                    key={opt.name}
                    opt={opt}
                    selectedId={selectedOptions[opt.name]}
                    onChange={(id) =>
                      setSelectedOptions((prev) => ({ ...prev, [opt.name]: id }))
                    }
                  />
                ))}
              </div>

              <div className="rounded-2xl border border-slate-200/90 bg-slate-50/50 p-5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">
                  Quantity
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    className="w-11 h-11 rounded-xl border border-slate-300 bg-white text-lg font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min={1}
                    max={99}
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(Math.max(1, Math.min(99, parseInt(e.target.value, 10) || 1)))
                    }
                    className="w-20 text-center text-lg font-bold py-2 border border-slate-300 rounded-xl bg-white"
                  />
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    className="w-11 h-11 rounded-xl border border-slate-300 bg-white text-lg font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                    onClick={() => setQuantity((q) => Math.min(99, q + 1))}
                  >
                    +
                  </button>
                </div>
              </div>

              {options.length > 0 && !variant && (
                <p className="text-sm font-medium text-amber-800 bg-amber-50 border border-amber-200/80 rounded-xl px-4 py-3">
                  Please select all options above to continue.
                </p>
              )}
              {variant && variant.is_available === false && (
                <p className="text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                  This combination is currently out of stock.
                </p>
              )}

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  disabled={!canAdd}
                  onClick={() => handleAddToCart(false)}
                  className="flex-1 py-4 rounded-2xl font-bold text-white bg-[#BF0637] hover:bg-[#a0052e] disabled:opacity-45 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-[#BF0637]/20 hover:shadow-xl hover:shadow-[#BF0637]/25 hover:-translate-y-0.5"
                >
                  Add to cart
                </button>
                <button
                  type="button"
                  disabled={!canAdd}
                  onClick={() => handleAddToCart(true)}
                  className="flex-1 py-4 rounded-2xl font-bold border-2 border-slate-900 text-slate-900 bg-white hover:bg-slate-50 disabled:opacity-45 disabled:cursor-not-allowed transition-all duration-200"
                >
                  Buy now
                </button>
              </div>

              <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 text-xs text-slate-500">
                <li className="flex items-center gap-2">
                  <span className="text-green-600 text-lg">✓</span> Secure checkout
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600 text-lg">✓</span> Print-on-demand
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600 text-lg">✓</span> Quality fulfillment
                </li>
              </ul>
            </div>
          </div>

          {/* Tabs + content */}
          <section className="mt-16 lg:mt-20 border-t border-slate-200 pt-10">
            <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-px mb-8">
              {(
                [
                  ["description", "Description"],
                  ["details", "Product details"],
                  ["variants", `Variants (${product.variants?.length ?? 0})`],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setDetailTab(id)}
                  className={`px-5 py-3 text-sm font-bold rounded-t-xl transition-all duration-200 ${
                    detailTab === id
                      ? "bg-white text-[#BF0637] border border-b-0 border-slate-200 -mb-px shadow-sm"
                      : "text-slate-500 hover:text-slate-800 hover:bg-slate-100/80"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {detailTab === "description" && (
              <div className="max-w-4xl merch-tab-panel">
                {product.description ? (
                  <ProductDescription html={product.description} />
                ) : (
                  <p className="text-slate-500">No description provided for this product.</p>
                )}
              </div>
            )}

            {detailTab === "details" && (
              <div className="max-w-3xl merch-tab-panel">
                <dl className="grid gap-3 sm:grid-cols-1">
                  {specRows.map((row) => (
                    <div
                      key={row.label}
                      className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-6 py-4 border-b border-slate-100 last:border-0"
                    >
                      <dt className="text-sm font-bold text-slate-500 shrink-0 sm:w-48">
                        {row.label}
                      </dt>
                      <dd className="text-sm text-slate-800 break-words">{row.value}</dd>
                    </div>
                  ))}
                </dl>
                {specRows.length === 0 && (
                  <p className="text-slate-500">No extra details available.</p>
                )}
                {extraApiFields.length > 0 && (
                  <details className="mt-10 rounded-2xl border border-slate-200 bg-slate-50/50 p-5 group">
                    <summary className="cursor-pointer text-sm font-bold text-slate-800 list-none flex items-center justify-between gap-2 [&::-webkit-details-marker]:hidden">
                      <span>More API fields ({extraApiFields.length})</span>
                      <span className="text-slate-400 text-lg leading-none group-open:rotate-180 transition-transform">
                        ▼
                      </span>
                    </summary>
                    <dl className="mt-4 space-y-3 border-t border-slate-200 pt-4 max-h-72 overflow-y-auto">
                      {extraApiFields.map(({ key, value }) => (
                        <div key={key} className="text-sm">
                          <dt className="font-mono text-xs text-slate-500 mb-0.5">{key}</dt>
                          <dd className="text-slate-800 break-all">{value}</dd>
                        </div>
                      ))}
                    </dl>
                  </details>
                )}
              </div>
            )}

            {detailTab === "variants" && product.variants && product.variants.length > 0 && (
              <div className="merch-tab-panel space-y-6">
                <p className="text-sm text-slate-600 max-w-3xl">
                  Every variant from Printify: options, SKU, weight, retail price, base cost (if
                  provided), fulfillment status, and whether the variant is enabled in the catalog.
                </p>
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <div className="max-h-[min(560px,62vh)] overflow-auto overscroll-contain">
                    <table className="w-full min-w-[720px] text-sm border-collapse">
                      <thead className="sticky top-0 z-1 bg-slate-900 text-white shadow-md">
                        <tr>
                          {options.length > 0 ? (
                            options.map((o) => (
                              <th
                                key={o.name}
                                className="text-left font-bold px-3 py-3 text-[11px] uppercase tracking-wider whitespace-nowrap border-b border-slate-700"
                              >
                                {o.name}
                              </th>
                            ))
                          ) : (
                            <th className="text-left font-bold px-3 py-3 text-[11px] uppercase tracking-wider border-b border-slate-700">
                              Variant
                            </th>
                          )}
                          <th className="text-left font-bold px-3 py-3 text-[11px] uppercase tracking-wider whitespace-nowrap border-b border-slate-700">
                            SKU
                          </th>
                          <th className="text-left font-bold px-3 py-3 text-[11px] uppercase tracking-wider border-b border-slate-700">
                            ID
                          </th>
                          <th className="text-left font-bold px-3 py-3 text-[11px] uppercase tracking-wider border-b border-slate-700">
                            Weight
                          </th>
                          <th className="text-right font-bold px-3 py-3 text-[11px] uppercase tracking-wider border-b border-slate-700">
                            Retail
                          </th>
                          <th className="text-right font-bold px-3 py-3 text-[11px] uppercase tracking-wider border-b border-slate-700">
                            Base cost
                          </th>
                          <th className="text-center font-bold px-3 py-3 text-[11px] uppercase tracking-wider border-b border-slate-700">
                            Active
                          </th>
                          <th className="text-center font-bold px-3 py-3 text-[11px] uppercase tracking-wider border-b border-slate-700">
                            Stock
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {product.variants.map((v, ri) => {
                          const opts = v.options ?? {};
                          const optionLabels =
                            options.length > 0
                              ? options.map((o) => {
                                  const id = opts[o.name] ?? opts[o.name.toLowerCase()];
                                  const val = o.values?.find((x) => x.id === id);
                                  return val?.title ?? "—";
                                })
                              : [];
                          const vr = v as Record<string, unknown>;
                          const sku =
                            vr.sku != null && String(vr.sku).trim() !== ""
                              ? String(vr.sku)
                              : "—";
                          const vTitle =
                            typeof vr.title === "string" && vr.title.trim() ? vr.title : null;
                          const enabled =
                            vr.is_enabled === false
                              ? false
                              : vr.is_enabled === true
                                ? true
                                : null;
                          return (
                            <tr
                              key={v.id}
                              className={`border-b border-slate-100 transition-colors duration-150 hover:bg-slate-50 ${
                                variant?.id === v.id
                                  ? "bg-[#BF0637]/8 ring-1 ring-inset ring-[#BF0637]/20"
                                  : ri % 2 === 0
                                    ? "bg-white"
                                    : "bg-slate-50/50"
                              } ${enabled === false ? "opacity-60" : ""}`}
                            >
                              {options.length > 0 ? (
                                optionLabels.map((label, i) => (
                                  <td
                                    key={i}
                                    className="px-3 py-2.5 text-slate-800 font-medium align-top"
                                  >
                                    {label}
                                  </td>
                                ))
                              ) : (
                                <td className="px-3 py-2.5 text-slate-800 align-top">
                                  {vTitle ?? `Variant #${v.id}`}
                                </td>
                              )}
                              <td className="px-3 py-2.5 font-mono text-xs text-slate-600 align-top max-w-[140px] break-all">
                                {sku}
                              </td>
                              <td className="px-3 py-2.5 font-mono text-xs text-slate-500 align-top whitespace-nowrap">
                                {v.id}
                              </td>
                              <td className="px-3 py-2.5 text-slate-600 align-top whitespace-nowrap">
                                {formatGrams(vr.grams)}
                              </td>
                              <td className="px-3 py-2.5 text-right font-bold text-slate-900 tabular-nums align-top">
                                {v.price != null ? formatPrintifyUsd(v.price) : "—"}
                              </td>
                              <td className="px-3 py-2.5 text-right text-slate-600 tabular-nums text-xs align-top">
                                {v.cost != null ? formatPrintifyUsd(v.cost) : "—"}
                              </td>
                              <td className="px-3 py-2.5 text-center align-top">
                                <span
                                  className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-bold ${
                                    enabled === false
                                      ? "bg-slate-200 text-slate-600"
                                      : enabled === true
                                        ? "bg-blue-100 text-blue-800"
                                        : "bg-slate-100 text-slate-500"
                                  }`}
                                >
                                  {enabled === false ? "Off" : enabled === true ? "On" : "—"}
                                </span>
                              </td>
                              <td className="px-3 py-2.5 text-center align-top">
                                <span
                                  className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold ${
                                    v.is_available === false
                                      ? "bg-red-100 text-red-800"
                                      : "bg-emerald-100 text-emerald-800"
                                  }`}
                                >
                                  {v.is_available === false ? "Unavailable" : "Available"}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}
