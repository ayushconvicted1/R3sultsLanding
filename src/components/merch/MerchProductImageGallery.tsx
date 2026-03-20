"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

const AUTO_SLIDE_MS = 4000;
const FADE_MS = 550;
const ZOOM = 2;
const LENS = 140;

function displayImageRect(cw: number, ch: number, nw: number, nh: number) {
  if (!nw || !nh) return { left: 0, top: 0, w: cw, h: ch };
  const scale = Math.min(cw / nw, ch / nh);
  const w = nw * scale;
  const h = nh * scale;
  return { left: (cw - w) / 2, top: (ch - h) / 2, w, h };
}

type Props = {
  urls: string[];
  title: string;
  autoPlay?: boolean;
};

export function MerchProductImageGallery({ urls, title, autoPlay = true }: Props) {
  const [idx, setIdx] = useState(0);
  const [pauseAuto, setPauseAuto] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);
  const [natural, setNatural] = useState({ w: 0, h: 0 });
  const [mouse, setMouse] = useState({ mx: 0, my: 0 });
  const [hover, setHover] = useState(false);
  const [pad, setPad] = useState(20);

  const safeIdx = urls.length ? idx % urls.length : 0;
  const currentUrl = urls[safeIdx] ?? "";

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 640px)");
    const sync = () => setPad(mq.matches ? 20 : 12);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (idx >= urls.length) setIdx(0);
  }, [urls.length, idx]);

  useEffect(() => {
    if (!autoPlay || urls.length <= 1 || pauseAuto) return;
    const t = window.setInterval(() => {
      setIdx((i) => (i + 1) % urls.length);
    }, AUTO_SLIDE_MS);
    return () => window.clearInterval(t);
  }, [urls.length, autoPlay, pauseAuto]);

  const onMainMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = mainRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setMouse({ mx: e.clientX - r.left, my: e.clientY - r.top });
  }, []);

  const go = (dir: -1 | 1) => {
    setPauseAuto(true);
    setIdx((i) => {
      const n = urls.length;
      if (!n) return 0;
      return (i + dir + n) % n;
    });
  };

  const loupeData = (() => {
    const el = mainRef.current;
    if (!el || !currentUrl) return null;
    const cw = el.clientWidth;
    const ch = el.clientHeight;
    const p = pad;
    const innerW = Math.max(1, cw - 2 * p);
    const innerH = Math.max(1, ch - 2 * p);
    const { mx, my } = mouse;

    const nw = natural.w;
    const nh = natural.h;
    if (nw > 0 && nh > 0) {
      const dr = displayImageRect(innerW, innerH, nw, nh);
      const imgLeft = p + dr.left;
      const imgTop = p + dr.top;
      const { w, h } = dr;
      const rx = (mx - imgLeft) / w;
      const ry = (my - imgTop) / h;
      if (rx < 0 || rx > 1 || ry < 0 || ry > 1) return null;
      const lx = Math.round(Math.min(Math.max(mx - LENS / 2, 0), cw - LENS));
      const ly = Math.round(Math.min(Math.max(my - LENS / 2, 0), ch - LENS));
      return { w, h, rx, ry, lx, ly, cw, ch, mode: "fit" as const };
    }

    const rx = (mx - p) / innerW;
    const ry = (my - p) / innerH;
    if (rx < 0 || rx > 1 || ry < 0 || ry > 1) return null;
    const lx = Math.round(Math.min(Math.max(mx - LENS / 2, 0), cw - LENS));
    const ly = Math.round(Math.min(Math.max(my - LENS / 2, 0), ch - LENS));
    return { w: innerW, h: innerH, rx, ry, lx, ly, cw, ch, mode: "fill" as const };
  })();

  if (!urls.length) {
    return (
      <div className="aspect-square rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
        No image
      </div>
    );
  }

  return (
    <div className="flex flex-col xl:flex-row gap-5 xl:gap-6 xl:items-start">
      <div className="flex xl:flex-col gap-2 order-2 xl:order-1 overflow-x-auto xl:overflow-y-auto xl:max-h-[min(640px,70vh)] pb-1 xl:pb-0 xl:w-[88px] shrink-0 scrollbar-thin">
        {urls.map((u, i) => (
          <button
            key={`${u}-${i}`}
            type="button"
            onClick={() => {
              setPauseAuto(true);
              setIdx(i);
            }}
            className={`relative shrink-0 w-[72px] h-[72px] xl:w-20 xl:h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#BF0637] focus-visible:ring-offset-2 ${
              i === safeIdx
                ? "border-[#BF0637] shadow-md scale-[1.02]"
                : "border-slate-200/90 hover:border-slate-300 opacity-85 hover:opacity-100"
            }`}
            aria-label={`View image ${i + 1}`}
            aria-current={i === safeIdx ? "true" : undefined}
          >
            <Image src={u} alt="" fill className="object-cover" sizes="80px" unoptimized />
          </button>
        ))}
      </div>

      <div className="flex-1 min-w-0 max-w-[560px] mx-auto w-full xl:mx-0 order-1 xl:order-2">
        <div
          ref={mainRef}
          className="relative aspect-square rounded-2xl border border-slate-200/90 bg-gradient-to-b from-slate-50 via-white to-slate-50/80 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.08)] overflow-hidden group cursor-crosshair touch-none"
          onMouseEnter={() => {
            setHover(true);
            setPauseAuto(true);
          }}
          onMouseLeave={() => setHover(false)}
          onMouseMove={onMainMove}
        >
          {/* Reliable natural size for current slide (Next/Image onLoadingComplete can miss) */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={currentUrl}
            src={currentUrl}
            alt=""
            className="absolute w-px h-px opacity-0 pointer-events-none"
            aria-hidden
            onLoad={(e) => {
              const im = e.currentTarget;
              setNatural({ w: im.naturalWidth, h: im.naturalHeight });
            }}
          />

          {urls.map((u, i) => (
            <div
              key={`main-${u}-${i}`}
              className="absolute inset-0 transition-opacity ease-in-out"
              style={{
                opacity: i === safeIdx ? 1 : 0,
                transitionDuration: `${FADE_MS}ms`,
                zIndex: i === safeIdx ? 2 : 1,
              }}
            >
              <Image
                src={u}
                alt={i === safeIdx ? title : ""}
                fill
                className="object-contain p-3 sm:p-5 pointer-events-none"
                sizes="(max-width: 1024px) 100vw, 560px"
                unoptimized
                priority={i === 0}
              />
            </div>
          ))}

          {hover && loupeData && (
            <div
              className="hidden md:block absolute z-[35] overflow-hidden rounded-xl border-[3px] border-white shadow-[0_16px_48px_-12px_rgba(0,0,0,0.45)] pointer-events-none bg-white ring-1 ring-black/10"
              style={{
                width: LENS,
                height: LENS,
                left: loupeData.lx,
                top: loupeData.ly,
                transition: "left 85ms ease-out, top 85ms ease-out",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentUrl}
                alt=""
                draggable={false}
                className="absolute select-none"
                style={{
                  width: loupeData.w * ZOOM,
                  height: loupeData.h * ZOOM,
                  left: LENS / 2 - loupeData.rx * loupeData.w * ZOOM,
                  top: LENS / 2 - loupeData.ry * loupeData.h * ZOOM,
                  maxWidth: "none",
                }}
              />
            </div>
          )}

          {urls.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => go(-1)}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-40 w-10 h-10 rounded-full bg-white/95 border border-slate-200/80 shadow-md flex items-center justify-center text-slate-700 hover:bg-white hover:scale-105 transition-all duration-200 opacity-0 group-hover:opacity-100 md:opacity-90 pointer-events-auto"
                aria-label="Previous image"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-40 w-10 h-10 rounded-full bg-white/95 border border-slate-200/80 shadow-md flex items-center justify-center text-slate-700 hover:bg-white hover:scale-105 transition-all duration-200 opacity-0 group-hover:opacity-100 md:opacity-90 pointer-events-auto"
                aria-label="Next image"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          <p className="sr-only">
            Image {safeIdx + 1} of {urls.length}. Hover for 2× zoom.
          </p>
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-slate-500 px-1">
          <span className="hidden md:inline text-slate-400">
            Hover on the image — 2× magnifier follows your cursor
          </span>
          {urls.length > 1 && (
            <span className="ml-auto tabular-nums font-medium text-slate-600">
              {safeIdx + 1} / {urls.length}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
