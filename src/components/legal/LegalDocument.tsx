import type { ReactNode } from "react";

const contentClassName =
  "mt-5 space-y-4 text-[15px] sm:text-base text-slate-700 leading-relaxed [&_h3]:mt-6 [&_h3]:first:mt-0 [&_h3]:text-base sm:[&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-slate-900 [&_h4]:mt-4 [&_h4]:text-sm sm:[&_h4]:text-base [&_h4]:font-semibold [&_h4]:text-[#BF0637] [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_li::marker]:text-[#BF0637] [&_p.uppercase]:text-xs sm:[&_p.uppercase]:text-sm [&_p.uppercase]:font-semibold [&_p.uppercase]:tracking-wide [&_p.uppercase]:text-slate-800";

export function LegalSection({
  title,
  children,
  id,
}: {
  title: string;
  children: ReactNode;
  id?: string;
}) {
  return (
    <section
      id={id}
      className="group scroll-mt-28 mt-6 first:mt-0 rounded-3xl border border-slate-200/90 bg-linear-to-br from-white via-white to-[#FFF5F8]/40 p-6 sm:p-8 shadow-[0_8px_30px_-12px_rgba(15,23,42,0.12),0_0_0_1px_rgba(191,6,55,0.06)] transition-shadow hover:shadow-[0_12px_40px_-12px_rgba(191,6,55,0.15),0_0_0_1px_rgba(191,6,55,0.08)]"
    >
      <div className="flex gap-4 sm:gap-5">
        <div
          className="mt-2 hidden h-full min-h-10 w-1 shrink-0 rounded-full bg-linear-to-b from-[#BF0637] to-[#8f0429] sm:block"
          aria-hidden
        />
        <div className="min-w-0 flex-1">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
            {title}
          </h2>
          <div className={contentClassName}>{children}</div>
        </div>
      </div>
    </section>
  );
}

export function LegalPageHero({
  badge,
  title,
  subtitle,
  children,
}: {
  badge: string;
  title: string;
  subtitle: string;
  children?: ReactNode;
}) {
  return (
    <div className="relative mt-8 sm:mt-10 overflow-hidden rounded-3xl border border-white/10 bg-linear-to-br from-slate-950 via-slate-900 to-slate-800 p-8 sm:p-10 md:p-12 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.45),0_0_0_1px_rgba(255,255,255,0.06)]">
      <div
        className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#BF0637]/25 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-white/5 blur-2xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(105deg,rgba(191,6,55,0.12)_0%,transparent_45%,transparent_100%)]"
        aria-hidden
      />
      <div className="relative z-10">
        <p className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-white/90 backdrop-blur-sm">
          {badge}
        </p>
        <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl md:leading-tight">
          {title}
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-300 sm:text-base">
          {subtitle}
        </p>
        {children ? <div className="mt-8 border-t border-white/10 pt-8">{children}</div> : null}
      </div>
    </div>
  );
}
