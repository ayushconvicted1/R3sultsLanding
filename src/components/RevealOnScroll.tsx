"use client";
import React, { useEffect, useRef } from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
};

export default function RevealOnScroll({ children, className = "" }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let rafId: number | null = null;

    function update() {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;

      // progress = how much of the element has entered the viewport (0..1)
      const visible = Math.min(
        Math.max((vh - rect.top) / (vh + rect.height), 0),
        1
      );

      // map visible to 0..100%
      const pct = Math.round(visible * 100);

      el.style.setProperty("--torch-x", pct + "%");

      rafId = null;
    }

    function onScroll() {
      if (rafId == null) rafId = requestAnimationFrame(update);
    }

    // set initial position
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`coming-soon-container ${className}`}
      // ensure default starting point
      style={{ ["--torch-x" as any]: "0%" }}
    >
      <div className="coming-soon-bg-text">{children}</div>
    </div>
  );
}
