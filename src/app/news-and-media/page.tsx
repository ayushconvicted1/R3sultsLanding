import Link from "next/link";
import type { Metadata } from "next";
import Footer from "@/components/Footer";
import NewsAndMediaFeed from "@/components/NewsAndMediaFeed";

export const metadata: Metadata = {
  title: "News & Media | R3sults",
  description:
    "Live U.S. disaster and hazard headlines from USGS, FEMA, NOAA NWS, and NASA EONET—official sources with links to full reports.",
};

export default function NewsAndMediaPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="relative overflow-hidden bg-slate-950 text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 80% 60% at 50% -20%, rgba(191, 6, 55, 0.35), transparent), radial-gradient(ellipse 50% 40% at 100% 50%, rgba(59, 130, 246, 0.12), transparent)",
          }}
        />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 sm:pt-32 sm:pb-20">
          <nav className="text-sm text-slate-400 mb-8">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-white">News and Media</span>
          </nav>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#f47296] mb-3">
            Official sources
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-5 max-w-3xl">
            News &amp; media
          </h1>
          <p className="text-slate-300 text-lg sm:text-xl max-w-2xl leading-relaxed">
            Real-time disaster and weather alerts drawn from the same live feed used on our home page—presented with context, timestamps, and direct links to each agency&apos;s full bulletin.
          </p>
        </div>
      </div>

      <NewsAndMediaFeed />

      <Footer />
    </div>
  );
}
