"use client";

import { useEffect, useState } from "react";

type FeedItem = {
  id: string;
  title: string;
  time: number;
  source: string;
  url: string;
};

function shuffleCopy<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function HeroDisasterTicker() {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [status, setStatus] = useState<"loading" | "ok" | "empty" | "error">(
    "loading",
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/disaster-feed");
        const data = await res.json();
        if (cancelled) return;
        const list: FeedItem[] = Array.isArray(data?.items) ? data.items : [];
        setItems(shuffleCopy(list));
        setStatus(list.length ? "ok" : "empty");
      } catch {
        if (!cancelled) setStatus("error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const loop = items.length ? [...items, ...items] : [];

  if (status === "loading") {
    return (
      <div className="hero-disaster-ticker border-t border-white/20 bg-black/55 backdrop-blur-md py-2.5 px-3">
        <p className="text-center text-xs text-white/70">
          Loading U.S. disaster &amp; alert feeds…
        </p>
      </div>
    );
  }

  if (status === "error" || status === "empty") {
    return (
      <div className="hero-disaster-ticker border-t border-white/20 bg-black/55 backdrop-blur-md py-2.5 px-3">
        <p className="text-center text-xs text-white/70">
          {status === "error"
            ? "Disaster feed temporarily unavailable."
            : "No recent items in the combined U.S. feeds right now."}
        </p>
      </div>
    );
  }

  return (
    <div className="hero-disaster-ticker group border-t border-white/25 bg-black/60 backdrop-blur-md overflow-hidden">
      <div className="flex items-center gap-3 px-3 py-2 min-h-[40px]">
        <span className="shrink-0 rounded bg-[#BF0637]/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
          Live
        </span>
        <span className="hidden sm:inline shrink-0 text-[10px] font-semibold uppercase tracking-wider text-white/60">
          U.S. disasters &amp; alerts
        </span>
        <div className="relative flex-1 min-w-0 overflow-hidden mask-linear-fade">
          <div className="hero-disaster-ticker-track flex w-max gap-10 items-center group-hover:[animation-play-state:paused]">
            {loop.map((item, i) => (
              <a
                key={`${item.id}-${i}`}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 text-sm text-white/95 hover:text-white underline-offset-2 hover:underline whitespace-nowrap"
              >
                <span className="text-white/50 font-medium mr-1.5">
                  {item.source}
                </span>
                {item.title}
              </a>
            ))}
          </div>
        </div>
      </div>
      {/* <p className="px-3 pb-1.5 text-[10px] text-white/45 text-center sm:text-left leading-snug">
        Sources:{" "}
        <a
          href="https://www.usgs.gov/programs/earthquake-hazards"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-white/70"
        >
          USGS
        </a>
        ,{" "}
        <a
          href="https://eonet.gsfc.nasa.gov/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-white/70"
        >
          NASA EONET
        </a>
        ,{" "}
        <a
          href="https://www.fema.gov/openfema-data-page/disaster-declarations-summaries-v2"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-white/70"
        >
          FEMA
        </a>
        ,{" "}
        <a
          href="https://www.weather.gov/documentation/services-web-alerts"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-white/70"
        >
          NOAA NWS
        </a>
        . Headlines open official pages in a new tab.
      </p> */}
      <style jsx global>{`
        @keyframes hero-disaster-marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .hero-disaster-ticker-track {
          animation: hero-disaster-marquee 165s linear infinite;
        }
        .mask-linear-fade {
          mask-image: linear-gradient(
            to right,
            transparent,
            black 4%,
            black 96%,
            transparent
          );
          -webkit-mask-image: linear-gradient(
            to right,
            transparent,
            black 4%,
            black 96%,
            transparent
          );
        }
      `}</style>
    </div>
  );
}
