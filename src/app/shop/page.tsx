"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  extractProducts,
  extractPagination,
  normalizeProduct,
  type Product,
  type RawProduct,
} from "@/types/product";
import { getProductsApiBase } from "@/lib/api";
import Footer from "@/components/Footer";

type SortOption = "name-asc" | "name-desc" | "price-asc" | "price-desc";

const SORT_LABELS: Record<SortOption, string> = {
  "name-asc": "Name A–Z",
  "name-desc": "Name Z–A",
  "price-asc": "Price: low to high",
  "price-desc": "Price: high to low",
};

function ProductCard({ product, index }: { product: Product; index: number }) {
  return (
    <Link
      href={`/shop/${product.id}`}
      className="group block bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col h-full"
      style={{
        animation: "shopCardFadeIn 0.4s ease-out forwards",
        animationDelay: `${index * 60}ms`,
        opacity: 0,
      }}
    >
      <div className="relative aspect-square bg-slate-50 overflow-hidden">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
            unoptimized={product.image.startsWith("http")}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
              (e.target as HTMLImageElement).nextElementSibling?.classList.remove("hidden");
            }}
          />
        ) : null}
        <div
          className={
            "absolute inset-0 flex items-center justify-center text-slate-400 text-sm " +
            (product.image ? "hidden" : "")
          }
        >
          No image
        </div>
        {product.isFeatured && (
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#BF0637] text-white text-xs font-semibold shadow">
            Featured
          </span>
        )}
      </div>
      <div className="p-5 flex flex-col flex-1">
        {product.category && (
          <span className="text-xs font-semibold text-[#BF0637] uppercase tracking-wider">
            {product.category}
          </span>
        )}
        <h3 className="font-semibold text-slate-900 mt-1 line-clamp-2 group-hover:text-[#BF0637] transition-colors">
          {product.name}
        </h3>
        <div className="mt-auto pt-4 flex items-baseline justify-between gap-2">
          <span className="text-lg font-bold text-slate-900">
            ${product.price.toFixed(2)}
          </span>
          <span className="text-sm font-medium text-[#BF0637] group-hover:underline">
            View product →
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function ShopPage() {
  const [raw, setRaw] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [sort, setSort] = useState<SortOption>("name-asc");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetch(`${getProductsApiBase()}/api/products`)
      .then((res) => {
        if (!res.ok) throw new Error(res.status === 500 ? "Server error" : "Failed to load products");
        return res.json();
      })
      .then((data) => {
        if (!cancelled) setRaw(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const products: Product[] = useMemo(() => {
    const list = extractProducts(raw);
    return list.map((p: RawProduct) => normalizeProduct(p));
  }, [raw]);

  const pagination = useMemo(() => extractPagination(raw), [raw]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set).sort();
  }, [products]);

  const filteredAndSorted = useMemo(() => {
    let list = products;
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.description?.toLowerCase().includes(q)) ||
          (p.category?.toLowerCase().includes(q)) ||
          (p.sku?.toLowerCase().includes(q)) ||
          (p.barcode?.toLowerCase().includes(q)) ||
          (p.brand?.toLowerCase().includes(q)) ||
          (p.tags?.some((t) => t.toLowerCase().includes(q)))
      );
    }
    if (categoryFilter) {
      list = list.filter((p) => p.category === categoryFilter);
    }
    const copy = [...list];
    switch (sort) {
      case "name-asc":
        copy.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        copy.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "price-asc":
        copy.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        copy.sort((a, b) => b.price - a.price);
        break;
    }
    return copy;
  }, [products, search, categoryFilter, sort]);

  if (loading) {
    return (
      <div className="min-h-screen pt-28 pb-16 flex flex-col items-center justify-center py-24">
        <div className="w-12 h-12 border-2 border-[#BF0637] border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-slate-600">Loading products…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-28 pb-16 flex flex-col items-center justify-center py-24 text-center px-4">
        <p className="text-red-600 font-medium">{error}</p>
        <p className="text-slate-500 text-sm mt-2">
          Ensure DOMAIN_NAME and AUTH_TOKEN are set in .env.local and the products API is reachable.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">Shop</h1>
          <p className="text-slate-600">
            Explore our products. Click any item to see full details and add to cart.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
          {/* Sidebar filters – left */}
          <aside className="lg:w-72 shrink-0">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sticky top-28 space-y-6">
              <h2 className="font-semibold text-slate-900 text-lg">Filters</h2>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Search</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </span>
                  <input
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Name, brand, SKU…"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-slate-900 text-sm placeholder-slate-400 focus:border-[#BF0637] focus:ring-2 focus:ring-[#BF0637]/20 outline-none"
                  />
                </div>
              </div>

              {categories.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                  <div className="flex flex-col gap-1.5">
                    <button
                      type="button"
                      onClick={() => setCategoryFilter("")}
                      className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        !categoryFilter
                          ? "bg-[#BF0637] text-white"
                          : "text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      All categories
                    </button>
                    {categories.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setCategoryFilter(c)}
                        className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                          categoryFilter === c
                            ? "bg-[#BF0637] text-white"
                            : "text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {c.replace(/_/g, " ")}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="sort-shop" className="block text-sm font-medium text-slate-700 mb-2">
                  Sort by
                </label>
                <select
                  id="sort-shop"
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortOption)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-700 text-sm bg-white focus:border-[#BF0637] focus:ring-2 focus:ring-[#BF0637]/20 outline-none"
                >
                  {(Object.keys(SORT_LABELS) as SortOption[]).map((k) => (
                    <option key={k} value={k}>
                      {SORT_LABELS[k]}
                    </option>
                  ))}
                </select>
              </div>

              <p className="text-slate-500 text-sm pt-2 border-t border-slate-100">
                {filteredAndSorted.length} product{filteredAndSorted.length !== 1 ? "s" : ""} shown
                {pagination ? ` · ${pagination.total} total` : ""}
              </p>
            </div>
          </aside>

          {/* Product grid – 3 per row on large screens */}
          <div className="flex-1 min-w-0">
            {filteredAndSorted.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center shadow-sm">
                <p className="text-slate-500 text-lg">No products match your filters.</p>
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setCategoryFilter("");
                  }}
                  className="mt-4 px-6 py-2.5 rounded-xl font-medium text-white hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: "#BF0637" }}
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAndSorted.map((product, index) => (
                  <li key={product.id} className="h-full">
                    <ProductCard product={product} index={index} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
