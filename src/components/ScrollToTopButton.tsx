"use client";

import { useEffect, useRef, useState } from "react";

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const onScroll = () => {
      setIsVisible(window.scrollY > 200);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const scrollToTop = () => {
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    const startY = window.scrollY;
    const duration = Math.min(1200, Math.max(700, startY * 0.6));
    const startTime = performance.now();

    const easeInOutCubic = (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeInOutCubic(progress);
      const nextY = startY * (1 - eased);

      window.scrollTo(0, nextY);

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        animationFrameRef.current = null;
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);
  };

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 transition-all duration-200 ${
        isVisible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Scroll to top"
        className="group inline-flex items-center rounded-full bg-[#BF0637] px-3 py-3 text-white shadow-lg transition-colors duration-200 hover:bg-[#a80532]"
      >
        <span className="block text-xl leading-none">↑</span>
        <span className="max-w-0 overflow-hidden whitespace-nowrap pl-0 text-sm font-medium leading-none opacity-0 transition-all duration-200 group-hover:max-w-28 group-hover:pl-2 group-hover:opacity-100">
          Back to Top
        </span>
      </button>
    </div>
  );
}
