"use client";

import { useEffect, useMemo, useState } from "react";
import Footer from "@/components/Footer";
import { MerchProductCard, type MerchCardProduct } from "@/components/merch/MerchProductCard";
import { variantPriceRangeCents } from "@/lib/printify-money";

const SHOP_ID = process.env.NEXT_PUBLIC_PRINTIFY_SHOP_ID ?? "";
const PAGE_LIMIT = 50;
const MAX_PAGES = 40;

type SortOption = "name-asc" | "name-desc" | "price-asc" | "price-desc";

const SORT_LABELS: Record<SortOption, string> = {
  "name-asc": "Name A–Z",
  "name-desc": "Name Z–A",
  "price-asc": "Price: low to high",
  "price-desc": "Price: high to low",
};

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function getProductTags(p: MerchCardProduct): string[] {
  const t = p.tags;
  if (Array.isArray(t)) return t.map((x) => String(x).trim()).filter(Boolean);
  if (typeof t === "string")
    return t
      .split(/[,;]/)
      .map((s) => s.trim())
      .filter(Boolean);
  return [];
}

export default function MerchPage() {
  const [products, setProducts] = useState<MerchCardProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shopId, setShopId] = useState(SHOP_ID);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [sort, setSort] = useState<SortOption>("name-asc");

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setLoading(true);
      setError(null);
      let sid = SHOP_ID;
      if (!sid) {
        const shopsRes = await fetch("/api/printify/shops");
        const shopsData = await shopsRes.json();
        if (!shopsRes.ok || !shopsData.success) {
          if (!cancelled) {
            setError(shopsData.error ?? "Failed to load shops");
            setLoading(false);
          }
          return;
        }
        const shops = shopsData.data?.shops ?? [];
        sid = shops[0]?.id != null ? String(shops[0].id) : "";
      }
      if (!sid) {
        if (!cancelled) {
          setError("No Printify shop configured. Set PRINTIFY_SHOP_ID or NEXT_PUBLIC_PRINTIFY_SHOP_ID.");
          setLoading(false);
        }
        return;
      }
      if (!cancelled) setShopId(sid);

      const all: MerchCardProduct[] = [];
      let page = 1;
      let total = 0;
      try {
        while (page <= MAX_PAGES && !cancelled) {
          const res = await fetch(
            `/api/printify/products?shop_id=${encodeURIComponent(sid)}&page=${page}&limit=${PAGE_LIMIT}`
          );
          const data = await res.json();
          if (!res.ok) {
            if (!cancelled) {
              setError(data.error ?? "Failed to load products");
              setLoading(false);
            }
            return;
          }
          const batch = (data.data?.products ?? []) as MerchCardProduct[];
          total = typeof data.data?.total === "number" ? data.data.total : batch.length;
          all.push(...batch);
          if (batch.length < PAGE_LIMIT || all.length >= total) break;
          page += 1;
        }
      } catch {
        if (!cancelled) {
          setError("Failed to load products");
          setLoading(false);
        }
        return;
      }
      if (cancelled) return;
      setProducts(all);
      setError(null);
      setLoading(false);
    }
    run();
    return () => {
      cancelled = true;
    };
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      getProductTags(p).forEach((t) => set.add(t));
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [products]);

  const filteredAndSorted = useMemo(() => {
    let list = [...products];
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((p) => {
        const title = (p.title ?? "").toLowerCase();
        const desc = p.description ? stripHtml(p.description) : "";
        const tagMatch = getProductTags(p).some((t) => t.toLowerCase().includes(q));
        return title.includes(q) || desc.includes(q) || tagMatch;
      });
    }
    if (categoryFilter) {
      list = list.filter((p) => getProductTags(p).includes(categoryFilter));
    }
    switch (sort) {
      case "name-asc":
        list.sort((a, b) => (a.title ?? "").localeCompare(b.title ?? ""));
        break;
      case "name-desc":
        list.sort((a, b) => (b.title ?? "").localeCompare(a.title ?? ""));
        break;
      case "price-asc": {
        list.sort((a, b) => {
          const ma = variantPriceRangeCents(a.variants).min ?? Number.MAX_SAFE_INTEGER;
          const mb = variantPriceRangeCents(b.variants).min ?? Number.MAX_SAFE_INTEGER;
          return ma - mb;
        });
        break;
      }
      case "price-desc": {
        list.sort((a, b) => {
          const ma = variantPriceRangeCents(a.variants).max ?? -1;
          const mb = variantPriceRangeCents(b.variants).max ?? -1;
          return mb - ma;
        });
        break;
      }
    }
    return list;
  }, [products, search, categoryFilter, sort]);

  const primaryTag = (p: MerchCardProduct) => {
    const tags = getProductTags(p);
    return tags[0];
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <div className="flex-1 pt-28 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">Merch</h1>
            <p className="text-slate-600">
              Official R3sults apparel &amp; gear. Prices exclude tax &amp; shipping until checkout.
            </p>
          </div>

          {loading && (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="w-12 h-12 border-2 border-[#BF0637] border-t-transparent rounded-full animate-spin" />
              <p className="mt-4 text-slate-600">Loading products…</p>
            </div>
          )}

          {error && !loading && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-red-800 text-sm">
              {error}
            </div>
          )}

          {!loading && !error && products.length === 0 && (
            <div className="rounded-2xl bg-white border border-slate-200 px-4 py-12 text-center text-slate-600 shadow-sm">
              No products yet. Check back soon.
            </div>
          )}

          {!loading && !error && products.length > 0 && (
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
              <aside className="lg:w-72 shrink-0">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sticky top-28 space-y-6">
                  <h2 className="font-semibold text-slate-900 text-lg">Filters</h2>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Search</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                      </span>
                      <input
                        type="search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Product name, tags…"
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-slate-900 text-sm placeholder-slate-400 focus:border-[#BF0637] focus:ring-2 focus:ring-[#BF0637]/20 outline-none"
                      />
                    </div>
                  </div>

                  {categories.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Category
                      </label>
                      <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto">
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
                            className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                              categoryFilter === c
                                ? "bg-[#BF0637] text-white"
                                : "text-slate-600 hover:bg-slate-100"
                            }`}
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <label htmlFor="sort-merch" className="block text-sm font-medium text-slate-700 mb-2">
                      Sort by
                    </label>
                    <select
                      id="sort-merch"
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
                    {filteredAndSorted.length} product{filteredAndSorted.length !== 1 ? "s" : ""}{" "}
                    shown
                    {products.length !== filteredAndSorted.length
                      ? ` · ${products.length} total`
                      : ""}
                  </p>
                </div>
              </aside>

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
                        <MerchProductCard
                          product={product}
                          shopId={shopId}
                          index={index}
                          categoryLabel={
                            categories.length > 0 ? primaryTag(product) : undefined
                          }
                        />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
