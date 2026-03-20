"use client";

import { useEffect, useRef } from "react";
import { parseGoogleAddressComponents } from "@/lib/google-place-address";
import type { PrintifyAddressTo } from "@/types/printify";

type Listener = { remove: () => void };

type GoogleMapsPlacesWindow = {
  google?: {
    maps?: {
      places?: {
        Autocomplete: new (
          el: HTMLInputElement,
          o: object
        ) => {
          addListener: (e: string, fn: () => void) => Listener;
          getPlace: () => {
            address_components?: Parameters<typeof parseGoogleAddressComponents>[0];
          };
        };
      };
      event?: { removeListener: (l: Listener) => void };
    };
  };
};

function getGoogle(): GoogleMapsPlacesWindow["google"] {
  return (window as unknown as GoogleMapsPlacesWindow).google;
}

export function useGooglePlacesAutocomplete(
  inputRef: React.RefObject<HTMLInputElement | null>,
  onParsed: (patch: Partial<PrintifyAddressTo>) => void
) {
  const onParsedRef = useRef(onParsed);
  onParsedRef.current = onParsed;

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.trim();
    if (!key) return;

    let listener: Listener | null = null;

    const attach = () => {
      const inp = inputRef.current;
      const g = getGoogle();
      if (!inp || !g?.maps?.places) return;
      try {
        const ac = new g.maps.places.Autocomplete(inp, {
          types: ["address"],
          fields: ["address_components"],
        });
        if (listener && g.maps.event) {
          try {
            g.maps.event.removeListener(listener);
          } catch {
            listener.remove();
          }
        }
        listener = ac.addListener("place_changed", () => {
          const place = ac.getPlace();
          const comps = place.address_components;
          if (!comps?.length) return;
          onParsedRef.current(parseGoogleAddressComponents(comps));
        });
      } catch {
        /* ignore */
      }
    };

    const tryAttach = () => queueMicrotask(attach);

    if (getGoogle()?.maps?.places) {
      tryAttach();
    } else {
      const id = "google-merch-places-sdk";
      let script = document.getElementById(id) as HTMLScriptElement | null;
      if (!script) {
        script = document.createElement("script");
        script.id = id;
        script.async = true;
        script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}&libraries=places`;
        script.addEventListener("load", tryAttach, { once: true });
        document.head.appendChild(script);
      } else {
        script.addEventListener("load", tryAttach, { once: true });
        if (getGoogle()?.maps?.places) {
          tryAttach();
        }
      }
    }

    return () => {
      const g = getGoogle();
      if (listener) {
        try {
          g?.maps?.event?.removeListener(listener);
        } catch {
          listener.remove();
        }
        listener = null;
      }
    };
  }, [inputRef]);
}
