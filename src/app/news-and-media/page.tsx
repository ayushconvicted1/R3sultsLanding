import Link from "next/link";
import type { Metadata } from "next";
import Footer from "@/components/Footer";
import NewsAndMediaFeed from "@/components/NewsAndMediaFeed";

export const metadata: Metadata = {
  title: "News & Media | R3sults",
  description:
    "Live global disaster and hazard headlines from the Global Disaster Alert and Coordination System (GDACS)—official sources with links to full reports.",
};

export default function NewsAndMediaPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="relative overflow-hidden bg-slate-950 text-white bg-[url('/news_and_media.avif')] bg-cover bg-center">
        {/* Dark overlay so text remains readable */}
        <div className="absolute inset-0 bg-slate-950/80"></div>
        <div
          className="pointer-events-none absolute inset-0 opacity-60 mix-blend-screen"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 80% 60% at 50% -20%, rgba(191, 6, 55, 0.45), transparent), radial-gradient(ellipse 50% 40% at 100% 50%, rgba(59, 130, 246, 0.2), transparent)",
          }}
        />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 sm:pt-32 sm:pb-20 z-10">
          <nav className="text-sm text-slate-400 mb-8">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-white">News and Media</span>
          </nav>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#f47296] mb-3">
            Global Monitoring
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-5 max-w-3xl">
            News &amp; Media
          </h1>
          <p className="text-slate-300 text-lg sm:text-xl max-w-2xl leading-relaxed">
            Real-time global disaster and emergency alerts from sources around the world—presented with context, severity metrics, and direct links to official reports.
          </p>
        </div>
      </div>

      <NewsAndMediaFeed />

      <Footer />
    </div>
  );
}
