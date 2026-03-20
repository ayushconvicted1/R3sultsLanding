"use client";

import { useMemo, useState } from "react";
import type { PrintifyOption } from "@/types/printify";

const INLINE_COLOR_MAX = 10;

function isColorOption(opt: PrintifyOption): boolean {
  const values = opt.values ?? [];
  const byType = opt.type === "color";
  const byName = /color|colour|cor|farbe|couleur/i.test(opt.name);
  const hasSwatches = values.some((v) => Array.isArray(v.colors) && v.colors.length > 0);
  return (byType || byName) && hasSwatches;
}

/** Selected first, then fill from list up to max (one row). */
function colorsForOneRow(
  values: NonNullable<PrintifyOption["values"]>,
  selectedId: number | undefined,
  max: number
) {
  if (values.length <= max) return values;
  const sel = values.find((v) => v.id === selectedId);
  const rest = values.filter((v) => v.id !== selectedId);
  const out: typeof values = [];
  if (sel) out.push(sel);
  for (const v of rest) {
    if (out.length >= max) break;
    out.push(v);
  }
  return out;
}

export function OptionPickerBlock({
  opt,
  selectedId,
  onChange,
}: {
  opt: PrintifyOption;
  selectedId: number | undefined;
  onChange: (id: number) => void;
}) {
  const values = opt.values ?? [];
  const selected = values.find((v) => v.id === selectedId);
  const selectedTitle = selected?.title ?? "Select…";
  const colorMode = isColorOption(opt);
  const [colorsExpanded, setColorsExpanded] = useState(false);

  const needsColorCollapse = colorMode && values.length > INLINE_COLOR_MAX;
  const visibleColorValues = useMemo(() => {
    if (!colorMode || !needsColorCollapse || colorsExpanded) return values;
    return colorsForOneRow(values, selectedId, INLINE_COLOR_MAX);
  }, [colorMode, needsColorCollapse, colorsExpanded, values, selectedId]);

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white/90 backdrop-blur-sm p-4 sm:p-5 shadow-sm transition-shadow duration-300 hover:shadow-md">
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
        <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-800">
          {opt.name}
        </h3>
        <span className="text-sm font-semibold text-[#BF0637]">{selectedTitle}</span>
      </div>

      {colorMode ? (
        <div>
          <div
            className={`items-center transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              needsColorCollapse && !colorsExpanded
                ? "flex flex-nowrap gap-x-4 sm:gap-x-5 overflow-x-auto overflow-y-visible py-1 px-0.5 [-webkit-overflow-scrolling:touch] [scrollbar-width:thin]"
                : "flex flex-wrap max-h-[2000px] items-end gap-x-5 gap-y-4 sm:gap-x-6"
            }`}
          >
            {visibleColorValues.map((val) => {
              const isOn = selectedId === val.id;
              const hex = val.colors?.[0];
              const hex2 = val.colors?.[1];
              const bgStyle =
                hex && hex2
                  ? { background: `linear-gradient(135deg, ${hex} 45%, ${hex2} 55%)` }
                  : hex
                    ? { backgroundColor: hex }
                    : { background: "linear-gradient(145deg, #e2e8f0 0%, #94a3b8 100%)" };
              const compact = needsColorCollapse && !colorsExpanded;

              return (
                <button
                  key={val.id}
                  type="button"
                  onClick={() => onChange(val.id)}
                  title={val.title}
                  className={`group shrink-0 flex flex-col items-center gap-1 rounded-xl mx-0.5 transition-transform duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#BF0637] focus-visible:ring-offset-2 ${
                    isOn ? "scale-105" : "hover:scale-105 active:scale-95"
                  }`}
                >
                  <span
                    className={`relative flex shrink-0 items-center justify-center rounded-full shadow-sm transition-all duration-300 ${
                      compact ? "w-7 h-7 sm:w-8 sm:h-8" : "w-9 h-9 sm:w-10 sm:h-10"
                    } ${
                      isOn
                        ? "ring-2 ring-[#BF0637] ring-offset-2 ring-offset-white shadow-md"
                        : "ring-1 ring-slate-300/90 ring-offset-1 ring-offset-white group-hover:ring-slate-400"
                    }`}
                    style={bgStyle}
                  >
                    {!hex && (
                      <span className="text-[9px] font-bold text-slate-600 select-none leading-none">
                        {val.title.slice(0, 1).toUpperCase()}
                      </span>
                    )}
                  </span>
                  {!compact && (
                    <span
                      className={`text-[10px] sm:text-xs font-medium text-center max-w-[3.75rem] leading-tight line-clamp-2 ${
                        isOn ? "text-slate-900" : "text-slate-500"
                      }`}
                    >
                      {val.title}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {needsColorCollapse && (
            <button
              type="button"
              onClick={() => setColorsExpanded((e) => !e)}
              className="mt-2.5 text-xs font-semibold text-[#BF0637] hover:text-[#a0052e] underline underline-offset-2 decoration-[#BF0637]/40 hover:decoration-[#BF0637] transition-colors duration-200"
            >
              {colorsExpanded
                ? "Show fewer colors"
                : `Choose more… (${Math.max(0, values.length - INLINE_COLOR_MAX)} more)`}
            </button>
          )}
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {values.map((val) => {
            const isOn = selectedId === val.id;
            return (
              <button
                key={val.id}
                type="button"
                onClick={() => onChange(val.id)}
                className={`min-h-[44px] min-w-[44px] px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#BF0637] focus-visible:ring-offset-2 ${
                  isOn
                    ? "bg-[#BF0637] text-white shadow-md shadow-[#BF0637]/20"
                    : "bg-slate-100 text-slate-800 border border-slate-200/80 hover:bg-white hover:border-slate-300"
                }`}
              >
                {val.title}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
