"use client";

import { useEffect, useMemo, useState } from "react";

export type DisasterFeedItem = {
  id: string;
  title: string;
  time: number;
  source: string;
  url: string;
};

type FeedResponse = {
  items?: DisasterFeedItem[];
  updatedAt?: number;
  error?: string;
};

const SOURCES = ["USGS", "FEMA", "NWS", "NASA EONET"] as const;
type SourceFilter = (typeof SOURCES)[number] | "all";

function sourceMeta(source: string) {
  const s = source.trim();
  if (s === "USGS")
    return {
      short: "USGS",
      name: "U.S. Geological Survey",
      blurb: "Earthquake locations, magnitude, and official event pages.",
      bar: "bg-emerald-500",
      chip: "bg-emerald-500/12 text-emerald-800 ring-emerald-500/25",
      cardBg: "from-emerald-500/[0.06] to-white",
    };
  if (s === "FEMA")
    return {
      short: "FEMA",
      name: "FEMA",
      blurb: "Presidential disaster declarations and federal assistance programs.",
      bar: "bg-blue-600",
      chip: "bg-blue-500/12 text-blue-900 ring-blue-500/25",
      cardBg: "from-blue-600/[0.06] to-white",
    };
  if (s === "NWS")
    return {
      short: "NWS",
      name: "NOAA / National Weather Service",
      blurb: "Active weather watches, warnings, and hazard statements.",
      bar: "bg-sky-600",
      chip: "bg-sky-500/12 text-sky-950 ring-sky-500/25",
      cardBg: "from-sky-500/[0.08] to-white",
    };
  if (s === "NASA EONET")
    return {
      short: "EONET",
      name: "NASA Earth Observatory (EONET)",
      blurb: "Natural events layer — wildfires, storms, volcanoes, and more.",
      bar: "bg-violet-600",
      chip: "bg-violet-500/12 text-violet-950 ring-violet-500/25",
      cardBg: "from-violet-500/[0.07] to-white",
    };
  return {
    short: s.slice(0, 12),
    name: s,
    blurb: "Official source link opens in a new tab.",
    bar: "bg-slate-500",
    chip: "bg-slate-100 text-slate-800 ring-slate-200",
    cardBg: "from-slate-100/80 to-white",
  };
}

function inferKind(title: string): string {
  const t = title.toLowerCase();
  if (/\bearthquake\b|\bm\s*[\d.]+|seismic|usgs\b/i.test(t)) return "Earthquake";
  if (/\bflood|flash flood|coastal flood|storm surge/i.test(t)) return "Flood";
  if (/\bfire|wildfire|brush fire|red flag/i.test(t)) return "Fire";
  if (/\btornado|severe thunderstorm|hail/i.test(t)) return "Severe storm";
  if (/\bhurricane|tropical storm|tropical depression|cyclone|typhoon/i.test(t))
    return "Tropical";
  if (/\bblizzard|winter storm|snow|ice storm|freeze|wind chill|sleet/i.test(t))
    return "Winter";
  if (/\bheat advisory|excessive heat|extreme heat|drought/i.test(t)) return "Heat / drought";
  if (/\bpower outage|blackout|no power|utilities.*outage/i.test(t)) return "Outage";
  if (/\blandslide|mudslide|avalanche/i.test(t)) return "Landslide";
  if (/\bvolcan|eruption|lava/i.test(t)) return "Volcano";
  if (/\btsunami/i.test(t)) return "Tsunami";
  if (/\bdisaster declaration|emergency declaration|fema\b/i.test(t)) return "Declaration";
  return "Hazard alert";
}

function formatAbsolute(ms: number): string {
  if (!ms) return "Time not available";
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "long",
      timeStyle: "short",
    }).format(new Date(ms));
  } catch {
    return new Date(ms).toLocaleString();
  }
}

function relativeTime(ms: number): string {
  if (!ms) return "";
  const sec = Math.floor((Date.now() - ms) / 1000);
  if (sec < 45) return "Just now";
  if (sec < 3600) return `${Math.floor(sec / 60)} min ago`;
  if (sec < 86400) return `${Math.floor(sec / 3600)} hr ago`;
  if (sec < 172800) return "Yesterday";
  return `${Math.floor(sec / 86400)} days ago`;
}

function ExternalIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  );
}

export default function NewsAndMediaFeed() {
  const [items, setItems] = useState<DisasterFeedItem[]>([]);
  const [updatedAt, setUpdatedAt] = useState<number | null>(null);
  const [status, setStatus] = useState<"loading" | "ok" | "empty" | "error">("loading");
  const [filter, setFilter] = useState<SourceFilter>("all");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/disaster-feed");
        const data: FeedResponse = await res.json();
        if (cancelled) return;
        if (!res.ok) {
          setStatus("error");
          return;
        }
        const list = Array.isArray(data.items) ? data.items : [];
        const sorted = [...list].sort((a, b) => (b.time || 0) - (a.time || 0));
        setItems(sorted);
        setUpdatedAt(typeof data.updatedAt === "number" ? data.updatedAt : Date.now());
        setStatus(sorted.length ? "ok" : "empty");
      } catch {
        if (!cancelled) setStatus("error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    if (filter === "all") return items;
    return items.filter((i) => i.source === filter);
  }, [items, filter]);

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const s of SOURCES) c[s] = 0;
    for (const i of items) {
      if (c[i.source] !== undefined) c[i.source] += 1;
    }
    return c;
  }, [items]);

  const featured = filtered[0];
  const rest = filtered.slice(1);

  if (status === "loading") {
    return (
      <div className="py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-slate-200 bg-white p-12 sm:p-16 shadow-sm">
            <div className="mx-auto max-w-md text-center">
              <div className="mx-auto mb-6 h-12 w-12 animate-spin rounded-full border-2 border-[#BF0637] border-t-transparent" aria-hidden />
              <p className="text-lg font-semibold text-slate-900">Loading live feeds</p>
              <p className="mt-2 text-sm text-slate-600">
                Pulling the latest U.S. hazard data from USGS, FEMA, NWS, and NASA EONET…
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-red-200 bg-red-50/80 p-8 sm:p-10 text-center">
            <p className="text-lg font-semibold text-red-900">We couldn&apos;t load the feed</p>
            <p className="mt-2 text-sm text-red-800/90 max-w-lg mx-auto">
              The disaster feed API is temporarily unavailable. Please refresh the page in a few minutes.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (status === "empty") {
    return (
      <div className="py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-10 text-center">
            <p className="text-lg font-semibold text-slate-900">No items right now</p>
            <p className="mt-2 text-sm text-slate-600 max-w-lg mx-auto">
              There are no recent disaster-themed entries in the combined feeds. Check back later—data refreshes about every five minutes.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-16 sm:pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Toolbar */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between mb-10 sm:mb-12">
          <div>
            {/* <p className="text-xs font-semibold uppercase tracking-wider text-[#BF0637] mb-2">Live data</p> */}
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-10">
              U.S. disasters &amp; alerts
            </h2>
            <p className="mt-2 text-slate-600 text-sm sm:text-base max-w-2xl leading-relaxed">
              Headlines are aggregated from authoritative public APIs. Each card links to the official page for full details, maps, and safety guidance.
            </p>
            {updatedAt != null && (
              <p className="mt-3 text-xs text-slate-500">
                Feed assembled{" "}
                <time dateTime={new Date(updatedAt).toISOString()}>
                  {formatAbsolute(updatedAt)}
                </time>
                <span className="text-slate-400"> · </span>
                Updates about every 5 minutes
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ring-1 ring-inset ${
                filter === "all"
                  ? "bg-slate-900 text-white ring-slate-900"
                  : "bg-white text-slate-700 ring-slate-200 hover:bg-slate-50"
              }`}
            >
              All ({items.length})
            </button>
            {SOURCES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setFilter(s)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ring-1 ring-inset ${
                  filter === s
                    ? "bg-[#BF0637] text-white ring-[#BF0637]"
                    : "bg-white text-slate-700 ring-slate-200 hover:bg-slate-50"
                }`}
              >
                {s === "NASA EONET" ? "NASA" : s} ({counts[s] ?? 0})
              </button>
            ))}
          </div>
        </div>

        {/* Source legend */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-10 sm:mb-12">
          {SOURCES.map((s) => {
            const m = sourceMeta(s);
            return (
              <div
                key={s}
                className="rounded-xl border border-slate-200/80 bg-white px-4 py-3 shadow-sm"
              >
                <div className={`h-1 w-10 rounded-full ${m.bar} mb-2`} />
                <p className="text-sm font-bold text-slate-900">{m.name}</p>
                <p className="text-xs text-slate-600 leading-snug mt-1">{m.blurb}</p>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 ? (
          <p className="text-center text-slate-600 py-12">No items for this source. Try &quot;All&quot;.</p>
        ) : (
          <>
            {/* Featured */}
            {featured && (
              <article className="mb-10 sm:mb-12 rounded-3xl border border-slate-200/90 bg-white shadow-lg shadow-slate-200/50 overflow-hidden">
                <div className="flex h-1.5 w-full">
                  <div className={`min-w-[28%] sm:min-w-[32%] ${sourceMeta(featured.source).bar}`} />
                  <div className="flex-1 bg-gradient-to-r from-[#BF0637] to-slate-500" />
                </div>
                <div className={`bg-gradient-to-br ${sourceMeta(featured.source).cardBg} p-6 sm:p-10 lg:p-12`}>
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ring-1 ${sourceMeta(featured.source).chip}`}>
                      {sourceMeta(featured.source).short}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-slate-900/5 px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/80">
                      {inferKind(featured.title)}
                    </span>
                    {featured.time ? (
                      <span className="text-xs font-medium text-slate-500">
                        {relativeTime(featured.time)}
                        <span className="text-slate-400"> · </span>
                        {formatAbsolute(featured.time)}
                      </span>
                    ) : null}
                  </div>
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 leading-tight tracking-tight mb-4">
                    {featured.title}
                  </h3>
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl mb-6">
                    <span className="font-semibold text-slate-800">{sourceMeta(featured.source).name}</span>
                    {" — "}
                    {sourceMeta(featured.source).blurb} Open the official link below for the complete bulletin, maps, and any recommended actions.
                  </p>
                  <a
                    href={featured.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-[#BF0637] px-5 py-3 text-sm font-bold text-white shadow-md shadow-[#BF0637]/25 hover:bg-[#a00530] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#BF0637] focus-visible:ring-offset-2"
                  >
                    View full official report
                    <ExternalIcon className="w-4 h-4 opacity-90" />
                  </a>
                </div>
              </article>
            )}

            {/* Grid */}
            <div className="grid gap-6 sm:gap-8 sm:grid-cols-2">
              {rest.map((item) => {
                const m = sourceMeta(item.source);
                const kind = inferKind(item.title);
                return (
                  <article
                    key={item.id}
                    className="group flex flex-col rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-xl hover:border-slate-300/80 transition-all duration-300"
                  >
                    <div className={`h-1 w-full ${m.bar}`} />
                    <div className="flex flex-col flex-1 p-5 sm:p-6">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide ring-1 ${m.chip}`}>
                          {m.short}
                        </span>
                        <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-700">
                          {kind}
                        </span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug mb-3 group-hover:text-[#BF0637] transition-colors">
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline decoration-[#BF0637]/40 underline-offset-2"
                        >
                          {item.title}
                        </a>
                      </h3>
                      <div className="mt-auto space-y-3 pt-2">
                        <dl className="grid grid-cols-1 gap-2 text-xs sm:text-sm">
                          <div className="flex flex-col sm:flex-row sm:gap-2 border-t border-slate-100 pt-3">
                            <dt className="font-semibold text-slate-500 shrink-0 sm:w-28">Source</dt>
                            <dd className="text-slate-800">{m.name}</dd>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:gap-2">
                            <dt className="font-semibold text-slate-500 shrink-0 sm:w-28">Reported</dt>
                            <dd className="text-slate-800">
                              {item.time ? (
                                <>
                                  <span className="font-medium text-slate-900">{formatAbsolute(item.time)}</span>
                                  <span className="text-slate-500"> ({relativeTime(item.time)})</span>
                                </>
                              ) : (
                                "Not specified"
                              )}
                            </dd>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:gap-2">
                            <dt className="font-semibold text-slate-500 shrink-0 sm:w-28">Summary</dt>
                            <dd className="text-slate-600 leading-relaxed">{m.blurb}</dd>
                          </div>
                        </dl>
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm font-bold text-[#BF0637] hover:text-[#a00530] mt-1"
                        >
                          Open official page
                          <ExternalIcon className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
