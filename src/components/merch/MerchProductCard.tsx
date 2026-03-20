"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  formatPrintifyPriceRange,
  variantPriceRangeCents,
} from "@/lib/printify-money";

const SLIDE_MS = 3500;
const FADE_MS = 700;

export interface MerchCardProduct {
  id: string;
  title?: string;
  description?: string;
  images?: Array<{ src?: string; url?: string }>;
  views?: Array<{
    files?: Array<{ src?: string; url?: string }>;
  }>;
  variants?: Array<{ id: number; price?: number; cost?: number; is_available?: boolean }>;
  options?: Array<{ name: string; values?: unknown[] }>;
  tags?: string[] | string;
}

function collectImageUrls(p: MerchCardProduct): string[] {
  const urls: string[] = [];
  const seen = new Set<string>();
  (p.images ?? []).forEach((img) => {
    const u = img.src ?? img.url ?? "";
    if (u && !seen.has(u)) {
      seen.add(u);
      urls.push(u);
    }
  });
  (p.views ?? []).forEach((view) => {
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

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function MerchProductCard({
  product,
  shopId,
  index,
  categoryLabel,
}: {
  product: MerchCardProduct;
  shopId: string;
  index: number;
  categoryLabel?: string;
}) {
  const imageUrls = useMemo(() => collectImageUrls(product), [product]);
  const [slideIndex, setSlideIndex] = useState(0);
  const [pause, setPause] = useState(false);

  useEffect(() => {
    if (imageUrls.length <= 1 || pause) return;
    const id = window.setInterval(() => {
      setSlideIndex((i) => (i + 1) % imageUrls.length);
    }, SLIDE_MS);
    return () => window.clearInterval(id);
  }, [imageUrls.length, pause]);

  const { min, max } = variantPriceRangeCents(product.variants);
  const priceStr = formatPrintifyPriceRange(min, max);
  const variantCount = product.variants?.length ?? 0;
  const optionSummaries =
    product.options
      ?.map((o) => {
        const n = o.values?.length ?? 0;
        return n > 0 ? `${o.name} (${n})` : o.name;
      })
      .slice(0, 3) ?? [];
  const descPlain = product.description ? stripHtml(product.description) : "";
  const descPreview =
    descPlain.length > 120 ? `${descPlain.slice(0, 120).trim()}…` : descPlain;

  const href = `/merch/${product.id}${shopId ? `?shop_id=${encodeURIComponent(shopId)}` : ""}`;

  return (
    <Link
      href={href}
      className="group flex flex-col bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 h-full"
      style={{
        animation: "shopCardFadeIn 0.4s ease-out forwards",
        animationDelay: `${index * 50}ms`,
        opacity: 0,
      }}
      onMouseEnter={() => setPause(true)}
      onMouseLeave={() => setPause(false)}
    >
      <div className="relative aspect-square bg-slate-100 overflow-hidden">
        {imageUrls.length > 0 ? (
          <div className="absolute inset-0 pointer-events-none">
            {imageUrls.map((url, i) => (
              <div
                key={url}
                className="absolute inset-0 transition-opacity ease-in-out"
                style={{
                  opacity: i === slideIndex ? 1 : 0,
                  transitionDuration: `${FADE_MS}ms`,
                  zIndex: i === slideIndex ? 2 : 1,
                }}
              >
                <Image
                  src={url}
                  alt=""
                  fill
                  className="object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                  sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                  unoptimized
                  aria-hidden={i !== slideIndex}
                />
              </div>
            ))}
            {/* Screen reader: current slide */}
            <span className="sr-only">
              {product.title ?? "Product"} image {slideIndex + 1} of {imageUrls.length}
            </span>
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-sm">
            No image
          </div>
        )}
        {imageUrls.length > 1 && (
          <div
            className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10 pointer-events-none"
            aria-hidden
          >
            {imageUrls.map((_, i) => (
              <span
                key={i}
                className="h-1.5 rounded-full transition-all duration-500 ease-out"
                style={{
                  width: i === slideIndex ? 22 : 6,
                  opacity: i === slideIndex ? 1 : 0.45,
                  backgroundColor: "white",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.25)",
                }}
              />
            ))}
          </div>
        )}
        {categoryLabel && (
          <span className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full bg-[#BF0637] text-white text-xs font-semibold shadow max-w-[70%] truncate">
            {categoryLabel}
          </span>
        )}
      </div>
      <div className="p-5 flex flex-col flex-1 gap-2">
        <h3 className="font-semibold text-slate-900 line-clamp-2 group-hover:text-[#BF0637] transition-colors duration-300 leading-snug">
          {product.title ?? "Untitled"}
        </h3>
        {descPreview && (
          <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">{descPreview}</p>
        )}
        {optionSummaries.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {optionSummaries.map((label, idx) => (
              <span
                key={`${label}-${idx}`}
                className="text-xs px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium"
              >
                {label}
              </span>
            ))}
          </div>
        )}
        {variantCount > 0 && (
          <p className="text-xs text-slate-500">
            {variantCount} variant{variantCount !== 1 ? "s" : ""}
          </p>
        )}
        <div className="mt-auto pt-3 border-t border-slate-100 flex flex-col gap-1">
          <div className="flex items-baseline justify-between gap-2 flex-wrap">
            {priceStr ? (
              <span className="text-lg font-bold text-slate-900">{priceStr}</span>
            ) : (
              <span className="text-sm text-slate-500">Price varies</span>
            )}
            <span className="text-sm font-medium text-[#BF0637] group-hover:underline shrink-0">
              View →
            </span>
          </div>
          <span className="text-[10px] uppercase tracking-wide text-slate-400 font-medium">
            Excl. tax &amp; shipping
          </span>
        </div>
      </div>
    </Link>
  );
}
