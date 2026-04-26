"use client";

import { useEffect, useMemo, useRef, useState } from "react";

interface ExpandableBioProps {
  text: string;
  className?: string;
  previewLines?: number;
}

export default function ExpandableBio({
  text,
  className = "",
  previewLines = 4,
}: ExpandableBioProps) {
  const contentRef = useRef<HTMLParagraphElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [collapsedHeight, setCollapsedHeight] = useState(0);
  const [fullHeight, setFullHeight] = useState(0);
  const [showToggle, setShowToggle] = useState(false);

  const maxHeight = useMemo(() => {
    if (!showToggle) return "none";
    return expanded ? `${fullHeight}px` : `${collapsedHeight}px`;
  }, [collapsedHeight, expanded, fullHeight, showToggle]);

  useEffect(() => {
    const element = contentRef.current;
    if (!element) return;

    const measure = () => {
      const computedStyle = window.getComputedStyle(element);
      const lineHeight = parseFloat(computedStyle.lineHeight) || 24;
      const nextCollapsedHeight = Math.round(lineHeight * previewLines);
      const nextFullHeight = element.scrollHeight;

      setCollapsedHeight(nextCollapsedHeight);
      setFullHeight(nextFullHeight);
      setShowToggle(nextFullHeight > nextCollapsedHeight + 2);
    };

    measure();
    window.addEventListener("resize", measure);

    return () => {
      window.removeEventListener("resize", measure);
    };
  }, [previewLines, text]);

  return (
    <div className="mt-6">
      <p
        ref={contentRef}
        className={`${className} overflow-hidden transition-[max-height] duration-300 ease-in-out`}
        style={{ maxHeight }}
      >
        {text}
      </p>
      {showToggle ? (
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="mt-2 text-sm font-semibold text-[#BF0637] transition-opacity hover:opacity-80"
          aria-expanded={expanded}
        >
          {expanded ? "Read less" : "Read more"}
        </button>
      ) : null}
    </div>
  );
}
