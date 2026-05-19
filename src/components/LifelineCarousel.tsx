"use client";

import Image from "next/image";
import {
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useCMSContent } from "@/context/CMSContentContext";

export default function LifelineCarousel() {
  const { data } = useCMSContent();
  const lifelineItems = data?.home.lifelineSection.featureCards || [];
  const n = lifelineItems.length;

  const slides = useMemo(
    () => [...lifelineItems, ...lifelineItems],
    [lifelineItems]
  );

  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const firstSlideRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef(0);
  const [step, setStep] = useState(304);
  const [index, setIndex] = useState(0);
  const [noTransition, setNoTransition] = useState(false);

  indexRef.current = index;

  const measureStep = useCallback(() => {
    const el = firstSlideRef.current;
    const track = trackRef.current;
    if (!el || !track) return;
    const style = getComputedStyle(track);
    const gap = parseFloat(style.columnGap || style.gap || "0") || 16;
    setStep(el.offsetWidth + gap);
  }, []);

  useLayoutEffect(() => {
    measureStep();
    const ro = new ResizeObserver(() => measureStep());
    if (trackRef.current) ro.observe(trackRef.current);
    if (firstSlideRef.current) ro.observe(firstSlideRef.current);
    return () => ro.disconnect();
  }, [measureStep]);

  const next = useCallback(() => {
    setNoTransition(false);
    setIndex((i) => i + 1);
  }, []);

  const prev = useCallback(() => {
    const i = indexRef.current;
    if (i > 0) {
      setNoTransition(false);
      setIndex(i - 1);
      return;
    }
    setNoTransition(true);
    setIndex(n);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setNoTransition(false);
        setIndex(n - 1);
      });
    });
  }, [n]);

  const onTransitionEnd = useCallback(
    (e: React.TransitionEvent<HTMLDivElement>) => {
      if (e.propertyName !== "transform") return;
      if (index >= n) {
        setNoTransition(true);
        setIndex(index - n);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => setNoTransition(false));
        });
      }
    },
    [index, n]
  );

  if (lifelineItems.length === 0) return null;

  return (
    <div className="relative mt-8 sm:mt-10 md:mt-12">
      <div
        ref={viewportRef}
        className="lifeline-carousel-viewport overflow-hidden w-full px-4 sm:px-6 lg:px-10 xl:px-12"
      >
        <div
          ref={trackRef}
          className="flex gap-4 sm:gap-5 lg:gap-6 lifeline-carousel-track"
          style={{
            transform: `translate3d(-${index * step}px, 0, 0)`,
            transition: noTransition
              ? "none"
              : "transform 0.55s cubic-bezier(0.25, 0.1, 0.25, 1)",
            willChange: "transform",
          }}
          onTransitionEnd={onTransitionEnd}
        >
          {slides.map((item, idx) => (
            <article
              key={`${item.title}-${idx}`}
              ref={idx === 0 ? firstSlideRef : undefined}
              data-slide
              className="relative h-[min(62vw,360px)] w-[calc(100vw-2rem)] sm:h-[360px] sm:w-[320px] md:h-[380px] md:w-[340px] lg:h-[400px] lg:w-[360px] shrink-0 overflow-hidden rounded-2xl shadow-lg ring-1 ring-white/10"
            >
              <Image
                src={item.image}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 340px, 360px"
                priority={idx < 2}
              />
              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-black/10"
                aria-hidden
              />
              <div className="absolute inset-x-0 bottom-0 z-10 p-4 sm:p-5">
                <h4 className="text-lg font-bold leading-snug text-white sm:text-xl">
                  {item.title}
                </h4>
                <div className="mt-1.5 text-sm leading-relaxed text-white/90">
                  {item.descriptionLines.map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3 px-4 sm:px-6 lg:px-10 xl:px-12 sm:mt-8">
        <button
          type="button"
          onClick={prev}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-black/45 text-white backdrop-blur-sm transition hover:bg-black/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          aria-label="Previous lifeline features"
        >
          <ChevronLeft />
        </button>
        <button
          type="button"
          onClick={next}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-black/45 text-white backdrop-blur-sm transition hover:bg-black/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          aria-label="Next lifeline features"
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
}

function ChevronLeft() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}
