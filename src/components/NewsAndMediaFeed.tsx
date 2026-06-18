"use client";

import { useEffect, useMemo, useState } from "react";

export type GDACSFeature = {
  type: string;
  properties: {
    eventtype: string;
    eventid: number;
    episodeid: number;
    name: string;
    description: string;
    htmldescription: string;
    icon: string;
    iconoverall: string;
    url: {
      report: string;
      details: string;
    };
    alertlevel: string; // Red, Orange, Green
    alertscore: number;
    country: string;
    fromdate: string;
    todate: string;
    severitydata: {
      severity: number;
      severitytext: string;
      severityunit: string;
    };
  };
};

type GDACSFeedResponse = {
  type: string;
  features: GDACSFeature[];
};

// Helper colors for alert levels
const ALERT_COLORS: Record<string, { bar: string; chip: string; cardBg: string }> = {
  Red: {
    bar: "bg-red-600",
    chip: "bg-red-100 text-red-800 ring-red-500/20",
    cardBg: "from-red-600/[0.08] to-white",
  },
  Orange: {
    bar: "bg-orange-500",
    chip: "bg-orange-100 text-orange-800 ring-orange-500/20",
    cardBg: "from-orange-500/[0.08] to-white",
  },
  Green: {
    bar: "bg-emerald-500",
    chip: "bg-emerald-100 text-emerald-800 ring-emerald-500/20",
    cardBg: "from-emerald-500/[0.08] to-white",
  },
};

const DEFAULT_ALERT_COLOR = {
  bar: "bg-slate-500",
  chip: "bg-slate-100 text-slate-800 ring-slate-500/20",
  cardBg: "from-slate-500/[0.08] to-white",
};

// Event type readable names
const EVENT_TYPES: Record<string, string> = {
  EQ: "Earthquake",
  TC: "Tropical Cyclone",
  FL: "Flood",
  VO: "Volcano",
  DR: "Drought",
  WF: "Wildfire",
};

function formatAbsolute(dateStr: string): string {
  if (!dateStr) return "Time not available";
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(dateStr));
  } catch {
    return new Date(dateStr).toLocaleString();
  }
}

function relativeTime(dateStr: string): string {
  if (!dateStr) return "";
  const ms = new Date(dateStr).getTime();
  const sec = Math.floor((Date.now() - ms) / 1000);
  if (sec < 60) return "Just now";
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

// Strip simple HTML tags if htmldescription has them
function stripHtml(html: string) {
  return html.replace(/<[^>]*>?/gm, '');
}

function NewsListItem({ item }: { item: GDACSFeature }) {
  const [expanded, setExpanded] = useState(false);
  const alertStyle = ALERT_COLORS[item.properties.alertlevel] || DEFAULT_ALERT_COLOR;
  const eventName = EVENT_TYPES[item.properties.eventtype] || item.properties.eventtype;
  
  const text = stripHtml(item.properties.htmldescription || item.properties.description);
  const hasSeverity = !!item.properties.severitydata?.severitytext;
  const isLong = text.length > 80 || hasSeverity;

  return (
    <article className="group flex flex-col sm:flex-row rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300">
      <div className={`w-full sm:w-1.5 ${alertStyle.bar} shrink-0 h-1.5 sm:h-auto`} />
      <div className="flex flex-col flex-1 p-4 relative">
        <div className="flex justify-between items-start mb-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ring-1 ${alertStyle.chip}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${alertStyle.bar}`}></span>
              {item.properties.alertlevel}
            </span>
            <span className="inline-flex items-center rounded-full bg-slate-900/5 px-2 py-0.5 text-[10px] font-semibold text-slate-700 ring-1 ring-slate-200/80">
              {eventName}
            </span>
          </div>
          {item.properties.icon && (
            <img src={item.properties.icon} alt={eventName} className="w-6 h-6 object-contain drop-shadow-sm" />
          )}
        </div>

        <h3 className="text-lg font-bold text-slate-900 leading-snug mb-1 group-hover:text-[#BF0637] transition-colors">
          <a
            href={item.properties.url?.report}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline decoration-[#BF0637]/40 underline-offset-2"
          >
            {item.properties.name || `${eventName} in ${item.properties.country}`}
          </a>
        </h3>
        
        <div className={`text-sm text-slate-600 mb-2 leading-relaxed transition-all duration-300 ${expanded ? '' : 'line-clamp-2'}`}>
          <p>{text}</p>
          {expanded && (
            <div className="mt-3 flex flex-col sm:flex-row gap-4">
              {hasSeverity && (
                <div className="flex-1 p-2 bg-slate-50 rounded-md border border-slate-100">
                  <span className="font-semibold text-slate-700 block text-xs uppercase mb-0.5 tracking-wider">Severity</span>
                  <p className="text-slate-600 text-sm">{item.properties.severitydata.severitytext}</p>
                </div>
              )}
              <div className="flex-1 p-2 bg-slate-50 rounded-md border border-slate-100">
                <span className="font-semibold text-slate-700 block text-xs uppercase mb-0.5 tracking-wider">Event Period</span>
                <p className="text-slate-600 text-sm">
                  {formatAbsolute(item.properties.fromdate)} — {formatAbsolute(item.properties.todate)}
                </p>
              </div>
            </div>
          )}
        </div>

        {isLong && (
          <button 
            onClick={() => setExpanded(!expanded)} 
            className="text-xs text-[#BF0637] font-bold self-start mb-2 flex items-center gap-1 hover:bg-red-50 px-2 py-1 -ml-2 rounded transition-colors"
          >
            {expanded ? "Read Less" : "Read More"}
            <svg className={`w-3.5 h-3.5 transition-transform ${expanded ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        )}

        <div className="mt-auto pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
          <span className="font-semibold text-slate-700 flex items-center gap-1.5">
            <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {item.properties.country}
          </span>
          <div className="flex items-center gap-3">
            <span>{relativeTime(item.properties.fromdate)}</span>
            <a
              href={item.properties.url?.report}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[#BF0637] hover:text-[#a00530] font-semibold"
            >
              Open Report
              <ExternalIcon className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function NewsAndMediaFeed() {
  const [items, setItems] = useState<GDACSFeature[]>([]);
  const [status, setStatus] = useState<"loading" | "ok" | "empty" | "error">("loading");
  
  // Filters
  const [eventTypeFilter, setEventTypeFilter] = useState<string>("all");
  const [alertFilter, setAlertFilter] = useState<string>("all");
  const [showOldDisasters, setShowOldDisasters] = useState<boolean>(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setStatus("loading");
        const baseUrl = process.env.NEXT_PUBLIC_GDACS_API_URL;
        if (!baseUrl) throw new Error("GDACS API URL not configured.");

        const endpoint = showOldDisasters ? "/SEARCH" : "/LATEST";
        const res = await fetch(`${baseUrl}${endpoint}`);
        if (!res.ok) throw new Error("Failed to fetch GDACS data");
        
        const data: GDACSFeedResponse = await res.json();
        if (cancelled) return;

        const features = data.features || [];
        
        // Sort by date (descending)
        const sorted = [...features].sort((a, b) => {
          return new Date(b.properties.fromdate).getTime() - new Date(a.properties.fromdate).getTime();
        });

        setItems(sorted);
        setStatus(sorted.length ? "ok" : "empty");
      } catch (err) {
        console.error("Error fetching GDACS:", err);
        if (!cancelled) setStatus("error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [showOldDisasters]);

  // Compute available event types for the filter
  const availableEventTypes = useMemo(() => {
    const types = new Set<string>();
    items.forEach((item) => {
      if (item.properties.eventtype) types.add(item.properties.eventtype);
    });
    return Array.from(types).sort();
  }, [items]);

  // Compute filtered items
  const filtered = useMemo(() => {
    return items.filter((item) => {
      const matchType = eventTypeFilter === "all" || item.properties.eventtype === eventTypeFilter;
      const matchAlert = alertFilter === "all" || item.properties.alertlevel === alertFilter;
      return matchType && matchAlert;
    });
  }, [items, eventTypeFilter, alertFilter]);

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <div className="pb-16 sm:pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title and Subheading at the Top */}
        <div className="flex flex-col gap-2 mb-6 mt-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Global Disaster Alerts
              </h2>
              <p className="text-slate-600 text-lg max-w-2xl leading-relaxed mt-2">
                Real-time monitoring from the Global Disaster Alert and Coordination System (GDACS).
              </p>
            </div>
            <label className="flex items-center gap-2 cursor-pointer bg-white border border-slate-200 px-4 py-2 rounded-lg shadow-sm hover:bg-slate-50 transition-colors self-start sm:self-auto shrink-0">
              <input
                type="checkbox"
                className="w-4 h-4 text-[#BF0637] rounded focus:ring-[#BF0637]"
                checked={showOldDisasters}
                onChange={(e) => setShowOldDisasters(e.target.checked)}
              />
              <span className="text-sm font-bold text-slate-700">Include Historical Disasters</span>
            </label>
          </div>
        </div>
        
        {/* Filters Below Subheading */}
        <div className="flex flex-col sm:flex-row gap-6 mb-10 pb-6 border-b border-slate-200">
          {/* Event Type Filter */}
          <div className="flex flex-col gap-2 flex-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Event Type</label>
            <div className="flex overflow-x-auto pb-2 scrollbar-hide gap-2">
              <button
                onClick={() => setEventTypeFilter("all")}
                className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-semibold transition-colors ring-1 ring-inset ${
                  eventTypeFilter === "all"
                    ? "bg-slate-900 text-white ring-slate-900 shadow-md"
                    : "bg-white text-slate-700 ring-slate-200 hover:bg-slate-50"
                }`}
              >
                All Events
              </button>
              {availableEventTypes.map((t) => (
                <button
                  key={t}
                  onClick={() => setEventTypeFilter(t)}
                  className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-semibold transition-colors ring-1 ring-inset ${
                    eventTypeFilter === t
                      ? "bg-[#BF0637] text-white ring-[#BF0637] shadow-md"
                      : "bg-white text-slate-700 ring-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {EVENT_TYPES[t] || t}
                </button>
              ))}
            </div>
          </div>

          {/* Alert Level Filter */}
          <div className="flex flex-col gap-2 shrink-0">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Alert Level</label>
            <div className="flex overflow-x-auto pb-2 scrollbar-hide gap-2">
              <button
                onClick={() => setAlertFilter("all")}
                className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-semibold transition-colors ring-1 ring-inset ${
                  alertFilter === "all"
                    ? "bg-slate-900 text-white ring-slate-900 shadow-md"
                    : "bg-white text-slate-700 ring-slate-200 hover:bg-slate-50"
                }`}
              >
                All Alerts
              </button>
              {["Red", "Orange", "Green"].map((level) => (
                <button
                  key={level}
                  onClick={() => setAlertFilter(level)}
                  className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-semibold transition-colors ring-1 ring-inset ${
                    alertFilter === level
                      ? "bg-slate-800 text-white ring-slate-800 shadow-md"
                      : "bg-white text-slate-700 ring-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <span className={`w-2.5 h-2.5 rounded-full ${level === 'Red' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]' : level === 'Orange' ? 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]'}`}></span>
                  {level}
                </button>
              ))}
            </div>
          </div>
        </div>

        {status === "loading" ? (
          <div className="py-16">
            <div className="rounded-2xl border border-slate-200 bg-white p-12 sm:p-16 shadow-sm">
              <div className="mx-auto max-w-md text-center">
                <div className="mx-auto mb-6 h-12 w-12 animate-spin rounded-full border-2 border-[#BF0637] border-t-transparent" aria-hidden />
                <p className="text-lg font-semibold text-slate-900">Loading GDACS Live Feed</p>
                <p className="mt-2 text-sm text-slate-600">
                  Pulling the latest global disaster data...
                </p>
              </div>
            </div>
          </div>
        ) : status === "error" ? (
          <div className="py-16">
            <div className="rounded-2xl border border-red-200 bg-red-50/80 p-8 sm:p-10 text-center">
              <p className="text-lg font-semibold text-red-900">We couldn&apos;t load the feed</p>
              <p className="mt-2 text-sm text-red-800/90 max-w-lg mx-auto">
                The GDACS API is temporarily unavailable. Please refresh the page in a few minutes.
              </p>
            </div>
          </div>
        ) : status === "empty" || filtered.length === 0 ? (
          <div className="py-16">
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
              <p className="text-lg font-semibold text-slate-900">No events found</p>
              <p className="mt-2 text-slate-500">Try adjusting your filters to see more results.</p>
              <button 
                onClick={() => { setEventTypeFilter("all"); setAlertFilter("all"); }}
                className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium rounded-lg transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {/* Featured Top Story */}
            {featured && (
              <article className="mb-4 rounded-3xl border border-slate-200/90 bg-white shadow-xl shadow-slate-200/50 overflow-hidden">
                <div className="flex h-1.5 w-full">
                  <div className={`w-1/3 ${(ALERT_COLORS[featured.properties.alertlevel] || DEFAULT_ALERT_COLOR).bar}`} />
                  <div className="flex-1 bg-gradient-to-r from-slate-200 to-slate-400" />
                </div>
                <div className={`bg-gradient-to-br ${(ALERT_COLORS[featured.properties.alertlevel] || DEFAULT_ALERT_COLOR).cardBg} p-6 sm:p-10 lg:p-12 relative`}>
                  
                  {/* GDACS Icon in background */}
                  {featured.properties.icon && (
                    <img 
                      src={featured.properties.icon} 
                      alt="" 
                      className="absolute top-10 right-10 w-32 h-32 opacity-10 object-contain pointer-events-none hidden sm:block" 
                    />
                  )}

                  <div className="flex flex-wrap items-center gap-2 mb-4 relative z-10">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ring-1 ${(ALERT_COLORS[featured.properties.alertlevel] || DEFAULT_ALERT_COLOR).chip}`}>
                      <span className={`w-2 h-2 rounded-full ${(ALERT_COLORS[featured.properties.alertlevel] || DEFAULT_ALERT_COLOR).bar}`}></span>
                      {featured.properties.alertlevel} Alert
                    </span>
                    <span className="inline-flex items-center rounded-full bg-slate-900/5 px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200/80">
                      {EVENT_TYPES[featured.properties.eventtype] || featured.properties.eventtype}
                    </span>
                    <span className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                      <span className="font-semibold text-slate-700">{featured.properties.country}</span>
                      <span className="text-slate-300">|</span>
                      {relativeTime(featured.properties.fromdate)}
                    </span>
                  </div>
                  
                  <h3 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight tracking-tight mb-4 relative z-10 max-w-4xl">
                    {featured.properties.name || `${EVENT_TYPES[featured.properties.eventtype] || 'Event'} in ${featured.properties.country}`}
                  </h3>
                  
                  <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl mb-8 relative z-10">
                    {stripHtml(featured.properties.htmldescription || featured.properties.description)}
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 relative z-10">
                    <a
                      href={featured.properties.url?.report}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#BF0637] px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-[#BF0637]/25 hover:bg-[#a00530] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#BF0637] focus-visible:ring-offset-2"
                    >
                      Read Full Report
                      <ExternalIcon className="w-4 h-4 opacity-90" />
                    </a>
                  </div>
                </div>
              </article>
            )}

            {/* List of remaining events */}
            <div className="flex flex-col gap-3">
              {rest.map((item, idx) => (
                <NewsListItem key={`${item.properties.eventid}-${idx}`} item={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
