"use client";

import { useEffect, useState } from "react";

export type NewsDataArticle = {
  article_id: string;
  link: string;
  title: string;
  description: string | null;
  content: string | null;
  pubDate: string;
  image_url: string | null;
  source_name: string;
  source_icon: string | null;
  creator?: string[] | null;
  keywords?: string[] | null;
  category?: string[] | null;
  language?: string;
  country?: string[];
};

type NewsDataResponse = {
  status: string;
  totalResults: number;
  results: NewsDataArticle[];
  nextPage: string | null;
};

const DISASTER_FILTERS = [
  "All",
  "Earthquake",
  "Flood",
  "Hurricane",
  "Tornado",
  "Tsunami",
  "Wildfire",
  "Landslide",
];

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

function stripHtml(html: string) {
  if (!html) return "";
  let text = html.replace(/<[^>]*>?/gm, '');
  return text.replace(/ONLY AVAILABLE IN PAID PLANS/gi, 'Click "Read Full Story on Original Site" to view complete details.');
}

function ArticleModal({ article, onClose }: { article: NewsDataArticle; onClose: () => void }) {
  if (!article) return null;

  const text = stripHtml(article.description || article.content || "");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-white/70 hover:bg-white text-slate-600 hover:text-slate-900 rounded-full shadow-sm backdrop-blur transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {article.image_url && (
          <div className="w-full h-64 sm:h-80 shrink-0 bg-slate-100 relative">
            <img src={article.image_url} alt={article.title} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="p-6 sm:p-8 flex-1">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            {article.source_icon && (
              <img src={article.source_icon} alt={article.source_name} className="w-6 h-6 object-contain rounded shadow-sm" />
            )}
            <span className="inline-flex items-center rounded-full bg-slate-900/5 px-3 py-1 text-xs font-bold text-slate-700 ring-1 ring-slate-200/80 uppercase tracking-wider">
              {article.source_name}
            </span>
            <span className="text-sm font-medium text-slate-500 flex items-center gap-1.5 ml-auto">
              {formatAbsolute(article.pubDate)}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight tracking-tight mb-6">
            {article.title}
          </h2>

          <div className="flex flex-wrap gap-2 mb-6">
            {article.category && article.category.map((cat, i) => (
              <span key={i} className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] sm:text-xs rounded-md uppercase font-bold tracking-wider">{cat}</span>
            ))}
            {article.country && article.country.map((c, i) => (
              <span key={i} className="px-2 py-1 bg-blue-50 text-blue-600 text-[10px] sm:text-xs rounded-md uppercase font-bold tracking-wider">{c}</span>
            ))}
            {article.language && (
              <span className="px-2 py-1 bg-emerald-50 text-emerald-600 text-[10px] sm:text-xs rounded-md uppercase font-bold tracking-wider">{article.language}</span>
            )}
          </div>

          <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed mb-8 text-base sm:text-lg">
            <p>{text}</p>
          </div>

          {article.creator && article.creator.length > 0 && (
            <div className="mb-4 text-sm text-slate-500">
              <strong className="text-slate-700">Creators:</strong> {article.creator.join(", ")}
            </div>
          )}

          {article.keywords && article.keywords.length > 0 && (
            <div className="mb-8">
              <strong className="text-slate-700 block text-sm mb-2">Keywords:</strong>
              <div className="flex flex-wrap gap-2">
                {article.keywords.map((kw, i) => (
                  <span key={i} className="px-2 py-1 bg-slate-50 border border-slate-100 text-slate-500 text-xs rounded-md">{kw}</span>
                ))}
              </div>
            </div>
          )}

          <div className="border-t border-slate-100 pt-6 flex justify-end">
            <a
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#BF0637] px-8 py-3 text-sm font-bold text-white shadow-md shadow-[#BF0637]/25 hover:bg-[#a00530] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#BF0637] focus-visible:ring-offset-2 hover:-translate-y-0.5"
            >
              Read Full Story on Original Site
              <ExternalIcon className="w-4 h-4 opacity-90" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function NewsListItem({ item, onReadMore }: { item: NewsDataArticle; onReadMore: (article: NewsDataArticle) => void }) {
  const text = stripHtml(item.description || item.content || "");
  const isLong = text.length > 100;

  return (
    <article className="group flex flex-col sm:flex-row rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300">
      {item.image_url ? (
        <div className="w-full sm:w-48 h-48 sm:h-auto shrink-0 overflow-hidden bg-slate-100 relative">
          <img src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        </div>
      ) : (
        <div className="w-full sm:w-1.5 bg-slate-200 shrink-0 h-1.5 sm:h-auto" />
      )}

      <div className="flex flex-col flex-1 p-4 sm:p-5 relative">
        <div className="flex items-center gap-2 mb-3">
          {item.source_icon && (
            <img src={item.source_icon} alt={item.source_name} className="w-5 h-5 object-contain rounded" />
          )}
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
            {item.source_name}
          </span>
          {item.category && item.category[0] && (
            <span className="ml-auto text-[10px] font-bold text-slate-400 uppercase tracking-wider hidden sm:block">
              {item.category[0]}
            </span>
          )}
        </div>

        <h3 className="text-lg font-bold text-slate-900 leading-snug mb-2 group-hover:text-[#BF0637] transition-colors cursor-pointer" onClick={() => onReadMore(item)}>
          {item.title}
        </h3>

        <div className={`text-sm text-slate-600 mb-3 leading-relaxed transition-all duration-300 line-clamp-2`}>
          <p>{text}</p>
        </div>

        {isLong && (
          <button
            onClick={() => onReadMore(item)}
            className="text-xs text-[#BF0637] font-bold self-start mb-3 flex items-center gap-1 hover:bg-red-50 px-2 py-1 -ml-2 rounded transition-colors"
          >
            Read More
            <svg className={`w-3.5 h-3.5`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        )}

        <div className="mt-auto pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
          <span className="font-medium text-slate-500">
            {formatAbsolute(item.pubDate)}
          </span>
          <div className="flex items-center gap-3">
            <span>{relativeTime(item.pubDate)}</span>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function NewsAndMediaFeed() {
  const [articles, setArticles] = useState<NewsDataArticle[]>([]);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [status, setStatus] = useState<"loading" | "ok" | "empty" | "error">("loading");
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>("All");

  // Modal state
  const [selectedArticle, setSelectedArticle] = useState<NewsDataArticle | null>(null);

  const fetchNews = async (pageToFetch: string | null, filter: string, isLoadMore: boolean) => {
    try {
      if (isLoadMore) {
        setIsLoadingMore(true);
      } else {
        setStatus("loading");
      }

      const cacheKey = `news_cache_data_${filter}`;
      const cacheTimeKey = `news_cache_time_${filter}`;
      const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

      // Check cache if it's the first page load
      if (!isLoadMore) {
        const cachedData = localStorage.getItem(cacheKey);
        const cachedTime = localStorage.getItem(cacheTimeKey);

        if (cachedData && cachedTime) {
          const age = Date.now() - parseInt(cachedTime, 10);
          if (age < TWENTY_FOUR_HOURS) {
            const parsedData: NewsDataResponse = JSON.parse(cachedData);
            const cachedArticles = parsedData.results || [];
            setArticles(cachedArticles);
            setNextPage(parsedData.nextPage || null);
            setStatus(cachedArticles.length ? "ok" : "empty");
            return;
          } else {
            // Cache expired
            localStorage.removeItem(cacheKey);
            localStorage.removeItem(cacheTimeKey);
          }
        }
      }

      const baseUrl = process.env.NEXT_PUBLIC_NEWSAPI_URL;
      if (!baseUrl) throw new Error("NewsData API URL not configured.");

      let qInTitle = "earthquake OR flood OR hurricane OR tornado OR tsunami OR wildfire OR landslide";

      if (filter !== "All") {
        qInTitle = filter.toLowerCase();
      }

      let url = `${baseUrl}&country=us&language=en&qInTitle=${encodeURIComponent(qInTitle)}`;
      if (pageToFetch) {
        url += `&page=${pageToFetch}`;
      }

      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch news data");

      const data: NewsDataResponse = await res.json();

      if (data.status !== "success") {
        throw new Error("API returned non-success status");
      }

      const fetchedArticles = data.results || [];

      if (isLoadMore) {
        setArticles(prev => [...prev, ...fetchedArticles]);
      } else {
        setArticles(fetchedArticles);
        // Save to cache for the initial page
        localStorage.setItem(cacheKey, JSON.stringify(data));
        localStorage.setItem(cacheTimeKey, Date.now().toString());
      }

      setNextPage(data.nextPage || null);

      if (!isLoadMore) {
        setStatus(fetchedArticles.length ? "ok" : "empty");
      }
    } catch (err) {
      console.error("Error fetching news:", err);
      if (!isLoadMore) setStatus("error");
    } finally {
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchNews(null, activeFilter, false);
  }, [activeFilter]);

  const featured = articles[0];
  const rest = articles.slice(1);

  return (
    <div className="pb-16 sm:pb-20 relative">
      {/* Article Modal */}
      {selectedArticle && (
        <ArticleModal article={selectedArticle} onClose={() => setSelectedArticle(null)} />
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Title and Subheading at the Top */}
        <div className="flex flex-col gap-2 mb-6 mt-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Disaster News Feed
              </h2>
              <p className="text-slate-600 text-lg max-w-2xl leading-relaxed mt-2">
                Latest updates on natural disasters and emergencies across the US.
              </p>
            </div>
          </div>
        </div>

        {/* Filters Below Subheading */}
        <div className="flex flex-col gap-2 mb-10 pb-6 border-b border-slate-200">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Filter by Disaster Type</label>
          <div className="flex overflow-x-auto pb-2 scrollbar-hide gap-2">
            {DISASTER_FILTERS.map((t) => (
              <button
                key={t}
                onClick={() => setActiveFilter(t)}
                className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-semibold transition-colors ring-1 ring-inset ${activeFilter === t
                    ? "bg-[#BF0637] text-white ring-[#BF0637] shadow-md"
                    : "bg-white text-slate-700 ring-slate-200 hover:bg-slate-50"
                  }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {status === "loading" ? (
          <div className="py-16">
            <div className="rounded-2xl border border-slate-200 bg-white p-12 sm:p-16 shadow-sm">
              <div className="mx-auto max-w-md text-center">
                <div className="mx-auto mb-6 h-12 w-12 animate-spin rounded-full border-2 border-[#BF0637] border-t-transparent" aria-hidden />
                <p className="text-lg font-semibold text-slate-900">Loading News Feed</p>
                <p className="mt-2 text-sm text-slate-600">
                  Fetching the latest updates...
                </p>
              </div>
            </div>
          </div>
        ) : status === "error" ? (
          <div className="py-16">
            <div className="rounded-2xl border border-red-200 bg-red-50/80 p-8 sm:p-10 text-center">
              <p className="text-lg font-semibold text-red-900">We couldn&apos;t load the feed</p>
              <p className="mt-2 text-sm text-red-800/90 max-w-lg mx-auto">
                The news API is temporarily unavailable or misconfigured. Please try again later.
              </p>
            </div>
          </div>
        ) : status === "empty" || articles.length === 0 ? (
          <div className="py-16">
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
              <p className="text-lg font-semibold text-slate-900">No news found</p>
              <p className="mt-2 text-slate-500">Try adjusting your filters to see more results.</p>
              <button
                onClick={() => setActiveFilter("All")}
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
              <article className="mb-4 rounded-3xl border border-slate-200/90 bg-white shadow-xl shadow-slate-200/50 overflow-hidden flex flex-col md:flex-row group">
                {featured.image_url ? (
                  <div className="w-full md:w-2/5 h-64 md:h-auto shrink-0 bg-slate-100 overflow-hidden relative">
                    <img
                      src={featured.image_url}
                      alt={featured.title}
                      className="w-full h-full object-cover absolute inset-0 group-hover:scale-105 transition-transform duration-700 cursor-pointer"
                      onClick={() => setSelectedArticle(featured)}
                    />
                  </div>
                ) : (
                  <div className="w-full md:w-2 bg-gradient-to-b from-[#BF0637] to-red-400 shrink-0 h-2 md:h-auto" />
                )}

                <div className="flex-1 bg-gradient-to-br from-slate-50 to-white p-6 sm:p-10 relative flex flex-col">
                  <div className="flex items-center gap-2 mb-4 relative z-10">
                    {featured.source_icon && (
                      <img src={featured.source_icon} alt={featured.source_name} className="w-6 h-6 object-contain rounded-md shadow-sm" />
                    )}
                    <span className="inline-flex items-center rounded-full bg-slate-900/5 px-3 py-1 text-xs font-bold text-slate-700 ring-1 ring-slate-200/80 uppercase tracking-wider">
                      {featured.source_name}
                    </span>
                    <span className="text-xs font-medium text-slate-500 flex items-center gap-1.5 ml-auto">
                      {relativeTime(featured.pubDate)}
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight tracking-tight mb-4 relative z-10 group-hover:text-[#BF0637] transition-colors duration-300 cursor-pointer" onClick={() => setSelectedArticle(featured)}>
                    {featured.title}
                  </h3>

                  <p className={`text-base text-slate-600 leading-relaxed mb-4 relative z-10 transition-all duration-300 line-clamp-3`}>
                    {stripHtml(featured.description || featured.content || "")}
                  </p>

                  {stripHtml(featured.description || featured.content || "").length > 150 && (
                    <button
                      onClick={() => setSelectedArticle(featured)}
                      className="text-sm text-[#BF0637] font-bold self-start mb-6 relative z-10 flex items-center gap-1 hover:bg-red-50 px-3 py-1.5 -ml-3 rounded-lg transition-colors"
                    >
                      Read More
                      <svg className={`w-4 h-4`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </button>
                  )}

                  <div className="mt-auto relative z-10">
                    <button
                      onClick={() => setSelectedArticle(featured)}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#BF0637] px-6 py-3 text-sm font-bold text-white shadow-md shadow-[#BF0637]/25 hover:bg-[#a00530] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#BF0637] focus-visible:ring-offset-2 hover:-translate-y-0.5"
                    >
                      Read Full Article
                      <svg className="w-4 h-4 opacity-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                      </svg>
                    </button>
                  </div>
                </div>
              </article>
            )}

            {/* List of remaining events */}
            <div className="flex flex-col gap-4">
              {rest.map((item) => (
                <NewsListItem key={item.article_id} item={item} onReadMore={setSelectedArticle} />
              ))}
            </div>

            {/* Show More Button */}
            {nextPage && (
              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => fetchNews(nextPage, activeFilter, true)}
                  disabled={isLoadingMore}
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-slate-900 text-white font-bold text-sm rounded-xl shadow-lg shadow-slate-900/20 hover:bg-slate-800 focus:ring-4 focus:ring-slate-900/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoadingMore ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Loading More...
                    </>
                  ) : (
                    "Show More News"
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
