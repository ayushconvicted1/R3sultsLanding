"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { parseGoogleAddressComponents } from "@/lib/google-place-address";
import type { PrintifyAddressTo } from "@/types/printify";

type Prediction = {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
};

type Props = {
  value: string;
  onChange: (line1: string) => void;
  onPlaceResolved: (patch: Partial<PrintifyAddressTo>) => void;
  countryHint?: string;
  inputClassName: string;
  placeholder?: string;
  required?: boolean;
};

function loadGooglePlacesScript(key: string): Promise<void> {
  if (
    (window as unknown as { google?: { maps?: { places?: unknown } } }).google?.maps?.places
  ) {
    return Promise.resolve();
  }
  const id = "google-merch-places-sdk";
  const existing = document.getElementById(id) as HTMLScriptElement | null;
  if (existing?.dataset.loaded === "1") return Promise.resolve();
  return new Promise((resolve, reject) => {
    let s = document.getElementById(id) as HTMLScriptElement | null;
    if (!s) {
      s = document.createElement("script");
      s.id = id;
      s.async = true;
      s.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}&libraries=places`;
      s.onload = () => {
        s!.dataset.loaded = "1";
        resolve();
      };
      s.onerror = () => reject(new Error("Google Maps failed to load"));
      document.head.appendChild(s);
    } else {
      if (
        (window as unknown as { google?: { maps?: { places?: unknown } } }).google?.maps?.places
      ) {
        resolve();
        return;
      }
      s.addEventListener("load", () => {
        s!.dataset.loaded = "1";
        resolve();
      }, { once: true });
    }
  });
}

export function MerchAddressAutocomplete({
  value,
  onChange,
  onPlaceResolved,
  countryHint,
  inputClassName,
  placeholder,
  required,
}: Props) {
  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.trim();
  const [open, setOpen] = useState(false);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(false);
  const [highlight, setHighlight] = useState(-1);
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sessionTokenRef = useRef<unknown>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const fetchPredictions = useCallback(
    (input: string) => {
      if (!key || input.trim().length < 3) {
        setPredictions([]);
        setLoading(false);
        return;
      }
      loadGooglePlacesScript(key).then(() => {
        const g = window.google as {
          maps: {
            places: {
              AutocompleteSessionToken: new () => unknown;
              AutocompleteService: new () => {
                getPlacePredictions: (
                  req: object,
                  cb: (r: Prediction[] | null, status: string) => void
                ) => void;
              };
              PlacesService: new (el: HTMLElement) => {
                getDetails: (
                  req: { placeId: string; fields: string[]; sessionToken?: unknown },
                  cb: (place: {
                    address_components?: Parameters<typeof parseGoogleAddressComponents>[0];
                    formatted_address?: string;
                  } | null,
                  status: string) => void
                ) => void;
              };
            };
          };
        };
        if (!sessionTokenRef.current) {
          sessionTokenRef.current = new g.maps.places.AutocompleteSessionToken();
        }
        const svc = new g.maps.places.AutocompleteService();
        const req: Record<string, unknown> = {
          input: input.trim(),
          types: ["address"],
          sessionToken: sessionTokenRef.current,
        };
        if (countryHint && countryHint.length === 2) {
          req.componentRestrictions = { country: countryHint.toLowerCase() };
        }
        svc.getPlacePredictions(req as never, (results, status) => {
          setLoading(false);
          if (status !== "OK" || !results?.length) {
            setPredictions([]);
            return;
          }
          setPredictions(results as Prediction[]);
        });
      });
    },
    [key, countryHint]
  );

  const onInputChange = (v: string) => {
    onChange(v);
    setHighlight(-1);
    setOpen(true);
    if (!key) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (v.trim().length >= 3) setLoading(true);
      fetchPredictions(v);
    }, 220);
  };

  const selectPrediction = useCallback(
    (p: Prediction) => {
      if (!key) return;
      loadGooglePlacesScript(key).then(() => {
        const g = window.google as {
          maps: {
            places: {
              PlacesService: new (el: HTMLElement) => {
                getDetails: (
                  req: { placeId: string; fields: string[]; sessionToken?: unknown },
                  cb: (
                    place: {
                      address_components?: Parameters<typeof parseGoogleAddressComponents>[0];
                      formatted_address?: string;
                    } | null,
                    status: string
                  ) => void
                ) => void;
              };
              AutocompleteSessionToken: new () => unknown;
            };
          };
        };
        const div = document.createElement("div");
        const ps = new g.maps.places.PlacesService(div);
        ps.getDetails(
          {
            placeId: p.place_id,
            fields: ["address_components", "formatted_address"],
            sessionToken: sessionTokenRef.current as never,
          },
          (place, status) => {
            sessionTokenRef.current = new g.maps.places.AutocompleteSessionToken();
            setOpen(false);
            setPredictions([]);
            const formatted = place?.formatted_address?.trim() ?? "";
            const firstLineFromFormatted = formatted
              ? formatted.split(",").slice(0, 2).join(",").trim()
              : "";
            if (status !== "OK" || !place?.address_components?.length) {
              onChange(firstLineFromFormatted || p.description.split(",")[0]?.trim() || p.structured_formatting.main_text);
              return;
            }
            const parsed = parseGoogleAddressComponents(place.address_components);
            const line1 =
              parsed.address1 ||
              firstLineFromFormatted ||
              p.description.split(",")[0]?.trim() ||
              p.structured_formatting.main_text;
            onChange(line1);
            onPlaceResolved({
              ...parsed,
              address1: line1,
            });
          }
        );
      });
    },
    [key, onChange, onPlaceResolved]
  );

  if (!key) {
    return (
      <input
        ref={inputRef}
        type="text"
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={inputClassName}
        placeholder={placeholder}
        autoComplete="street-address"
      />
    );
  }

  return (
    <div ref={wrapRef} className="relative z-[100]">
      <input
        ref={inputRef}
        type="text"
        required={required}
        value={value}
        onChange={(e) => onInputChange(e.target.value)}
        onFocus={() => {
          if (predictions.length) setOpen(true);
        }}
        onKeyDown={(e) => {
          if (!open || !predictions.length) return;
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setHighlight((h) => Math.min(h + 1, predictions.length - 1));
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setHighlight((h) => Math.max(h - 1, 0));
          } else if (e.key === "Enter" && highlight >= 0) {
            e.preventDefault();
            selectPrediction(predictions[highlight]);
          } else if (e.key === "Escape") {
            setOpen(false);
          }
        }}
        className={inputClassName}
        placeholder={placeholder}
        autoComplete="off"
        aria-autocomplete="list"
        aria-expanded={open}
      />
      {loading && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">…</span>
      )}
      {open && predictions.length > 0 && (
        <ul
          className="absolute left-0 right-0 top-full mt-2 max-h-72 overflow-y-auto rounded-2xl border border-stone-200/90 bg-white py-2 shadow-[0_16px_48px_-12px_rgba(15,23,42,0.18)] ring-1 ring-black/5 z-[200]"
          role="listbox"
        >
          {predictions.map((pred, i) => (
            <li key={pred.place_id} role="option" aria-selected={i === highlight}>
              <button
                type="button"
                className={`w-full text-left px-4 py-3.5 transition-colors border-b border-stone-100 last:border-0 ${
                  i === highlight ? "bg-[#BF0637]/8" : "hover:bg-stone-50"
                }`}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => selectPrediction(pred)}
                onMouseEnter={() => setHighlight(i)}
              >
                <span className="block text-[13px] sm:text-sm font-medium text-stone-900 leading-relaxed whitespace-normal break-words">
                  {pred.description}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
