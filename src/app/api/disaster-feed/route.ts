import { NextResponse } from "next/server";

/** Rough USA + AK/HI/territories bounding box for filtering point locations. */
const USA = { minLat: 15, maxLat: 72, minLon: -179, maxLon: -64 };

function inUsaBbox(lon: number, lat: number): boolean {
  return (
    lat >= USA.minLat &&
    lat <= USA.maxLat &&
    lon >= USA.minLon &&
    lon <= USA.maxLon
  );
}

function parseTimeMs(t: string | number | undefined): number {
  if (t == null) return 0;
  if (typeof t === "number") return t;
  const s = String(t).trim();
  const dotNet = /\/Date\((\d+)\)\//.exec(s);
  if (dotNet) return Number(dotNet[1]);
  const ms = Date.parse(s);
  return Number.isFinite(ms) ? ms : 0;
}

/** Fisher–Yates shuffle (copy) — juggles feed order each response build. */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Headlines must match disaster / hazard themes (fire, quake, volcano, winter,
 * outages, storms, floods, etc.). USGS + FEMA always allowed (authoritative disaster feeds).
 */
const DISASTER_PATTERNS: RegExp[] = [
  /\bearthquake\b/i,
  /\bquake\b/i,
  /\bseismic\b/i,
  /\bm\s*[\d.]+\s*[-—]/i, // USGS-style "M 4.2 —"
  /\bfire\b/i,
  /\bwildfire/i,
  /\bwildfires\b/i,
  /\bbrush\s*fire\b/i,
  /\bred\s*flag\b/i,
  /\bvolcan/i,
  /\beruption\b/i,
  /\blava\b/i,
  /\bsnow\b/i,
  /\bblizzard\b/i,
  /\bwinter\s*storm\b/i,
  /\bice\s*storm\b/i,
  /\bsleet\b/i,
  /\bfreezing\s*rain\b/i,
  /\bpolar\s*vortex\b/i,
  /\bpower\s*outage\b/i,
  /\bblackout\b/i,
  /\boutage\b/i,
  /\bgrid\b.*\b(emergency|failure|down)\b/i,
  /\butilities?\b.*\boutage\b/i,
  /\bno\s*power\b/i,
  /\bhurricane\b/i,
  /\btropical\s*storm\b/i,
  /\btornado\b/i,
  /\bsevere\s*thunderstorm\b/i,
  /\bflood\b/i,
  /\bflash\s*flood\b/i,
  /\bstorm\s*surge\b/i,
  /\bcoastal\s*flood\b/i,
  /\blandslide\b/i,
  /\bmudslide\b/i,
  /\bavalanche\b/i,
  /\bdrought\b/i,
  /\bextreme\s*heat\b/i,
  /\bexcessive\s*heat\b/i,
  /\bheat\s*advisory\b/i,
  /\bhigh\s*wind\b/i,
  /\bextreme\s*wind\b/i,
  /\bderecho\b/i,
  /\bfreeze\b/i,
  /\bhard\s*freeze\b/i,
  /\bfrost\b/i,
  /\bwind\s*chill\b/i,
  /\btsunami\b/i,
  /\bevacuation\b/i,
  /\bemergency\s*declaration\b/i,
  /\bdisaster\s*declaration\b/i,
  /\btropical\s*depression\b/i,
  /\bcyclone\b/i,
  /\btyphoon\b/i,
];

function passesDisasterTheme(item: DisasterFeedItem): boolean {
  if (item.source === "USGS" || item.source === "FEMA") return true;
  const text = `${item.title} ${item.source}`;
  return DISASTER_PATTERNS.some((re) => re.test(text));
}

/** First coordinate pair from GeoJSON-style geometry (EONET). */
function firstLonLat(geom: {
  type?: string;
  coordinates?: unknown;
}): [number, number] | null {
  const c = geom?.coordinates;
  if (!c) return null;
  if (
    (!geom.type || geom.type === "Point") &&
    Array.isArray(c) &&
    c.length >= 2 &&
    typeof c[0] === "number" &&
    typeof c[1] === "number"
  ) {
    return [c[0], c[1]];
  }
  const t = geom.type;
  if (t === "Point" && Array.isArray(c) && c.length >= 2) {
    const lon = Number(c[0]);
    const lat = Number(c[1]);
    return Number.isFinite(lon) && Number.isFinite(lat) ? [lon, lat] : null;
  }
  if (t === "LineString" && Array.isArray(c) && c[0]?.length >= 2) {
    const lon = Number(c[0][0]);
    const lat = Number(c[0][1]);
    return Number.isFinite(lon) && Number.isFinite(lat) ? [lon, lat] : null;
  }
  if (t === "Polygon" && Array.isArray(c) && c[0]?.[0]?.length >= 2) {
    const lon = Number(c[0][0][0]);
    const lat = Number(c[0][0][1]);
    return Number.isFinite(lon) && Number.isFinite(lat) ? [lon, lat] : null;
  }
  if (t === "MultiPolygon" && Array.isArray(c) && c[0]?.[0]?.[0]?.length >= 2) {
    const lon = Number(c[0][0][0][0]);
    const lat = Number(c[0][0][0][1]);
    return Number.isFinite(lon) && Number.isFinite(lat) ? [lon, lat] : null;
  }
  return null;
}

const USGS_URL =
  "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&limit=22&orderby=time&minmagnitude=2.5&minlatitude=15&maxlatitude=72&minlongitude=-179&maxlongitude=-64";

const EONET_URL =
  "https://eonet.gsfc.nasa.gov/api/v3/events?days=30&status=open&limit=250";

const FEMA_URL =
  "https://www.fema.gov/api/open/v2/DisasterDeclarationsSummaries?$format=json&$orderby=declarationDate%20desc&$top=40";

const NOAA_ALERTS_URL =
  "https://api.weather.gov/alerts/active?status=actual&limit=200";

const JSON_HEADERS = {
  Accept: "application/json",
  "User-Agent":
    "R3sultsLanding/1.0 (disaster-awareness ticker; +https://r3sults.com)",
} as const;

const FETCH_JSON = {
  headers: JSON_HEADERS,
  next: { revalidate: 300 } as const,
};

export const revalidate = 300;

export type DisasterFeedItem = {
  id: string;
  title: string;
  time: number;
  source: string;
  url: string;
};

type UsgsFeature = {
  id?: string;
  properties: {
    mag?: number;
    place?: string;
    time?: number;
    url?: string;
    title?: string;
    code?: string;
    ids?: string;
  };
};

function usgsEventId(f: UsgsFeature): string {
  const p = f.properties;
  if (p.code?.trim()) return p.code.trim();
  if (p.ids) {
    const parts = p.ids.split(",").map((s) => s.trim()).filter(Boolean);
    if (parts.length) return parts[0];
  }
  if (f.id) return String(f.id);
  return "";
}

async function fetchUsgs(): Promise<DisasterFeedItem[]> {
  const res = await fetch(USGS_URL, FETCH_JSON);
  if (!res.ok) return [];
  const data = await res.json();
  const features: UsgsFeature[] = Array.isArray(data?.features)
    ? data.features
    : [];
  const out: DisasterFeedItem[] = [];
  for (const f of features) {
    const id = usgsEventId(f);
    const url = f.properties?.url?.trim();
    if (!id || !url) continue;
    const title =
      f.properties?.title?.trim() ||
      (f.properties?.mag != null && f.properties?.place
        ? `M ${f.properties.mag} — ${f.properties.place}`
        : f.properties?.place || "Earthquake");
    out.push({
      id: `usgs-${id}`,
      title,
      time: f.properties?.time ?? 0,
      source: "USGS",
      url,
    });
  }
  return out;
}

type EonetEvent = {
  id?: string | number;
  title?: string;
  link?: string;
  categories?: { id?: number; title?: string }[];
  sources?: { id?: string; url?: string }[];
  geometries?: { date?: string; coordinates?: unknown; type?: string }[];
};

async function fetchEonet(): Promise<DisasterFeedItem[]> {
  const res = await fetch(EONET_URL, FETCH_JSON);
  if (!res.ok) return [];
  const data = await res.json();
  const events: EonetEvent[] = Array.isArray(data?.events) ? data.events : [];
  const out: DisasterFeedItem[] = [];
  for (const ev of events) {
    const geoms = ev.geometries;
    if (!geoms?.length) continue;
    const latest = geoms[geoms.length - 1];
    const ll = firstLonLat({
      type: latest.type || "Point",
      coordinates: latest.coordinates,
    });
    if (!ll || !inUsaBbox(ll[0], ll[1])) continue;

    const sourceUrl =
      ev.sources?.find((s) => s.url?.startsWith("http"))?.url?.trim() ||
      ev.link?.trim();
    if (!sourceUrl) continue;

    const cat = ev.categories?.[0]?.title || "Event";
    const title = (ev.title || `${cat} (NASA EONET)`).trim();
    const id = String(ev.id ?? title).slice(0, 80);
    out.push({
      id: `eonet-${id}`,
      title: `[${cat}] ${title}`,
      time: parseTimeMs(latest.date),
      source: "NASA EONET",
      url: sourceUrl,
    });
  }
  return out;
}

type FemaRow = Record<string, unknown>;

function extractFemaRows(data: unknown): FemaRow[] {
  if (!data || typeof data !== "object") return [];
  const d = data as Record<string, unknown>;
  const raw =
    d.DisasterDeclarationsSummaries ?? d.disasterDeclarationsSummaries;
  if (Array.isArray(raw)) return raw;
  return [];
}

function rowString(row: FemaRow, ...keys: string[]): string | undefined {
  for (const k of keys) {
    const v = row[k];
    if (v != null && String(v).trim()) return String(v).trim();
  }
  return undefined;
}

function rowNum(row: FemaRow, ...keys: string[]): string | number | undefined {
  for (const k of keys) {
    const v = row[k];
    if (v != null && v !== "") return v as string | number;
  }
  return undefined;
}

async function fetchFema(): Promise<DisasterFeedItem[]> {
  const res = await fetch(FEMA_URL, FETCH_JSON);
  if (!res.ok) return [];
  let data: unknown;
  try {
    data = await res.json();
  } catch {
    return [];
  }
  const rows = extractFemaRows(data);
  const out: DisasterFeedItem[] = [];
  for (const row of rows) {
    const num = rowNum(row, "disasterNumber", "DisasterNumber", "disaster_number");
    const title = rowString(row, "declarationTitle", "DeclarationTitle", "declaration_title", "title");
    if (num == null || !title) continue;
    const url = `https://www.fema.gov/disaster/${num}`;
    const dateRaw = row.declarationDate ?? row.DeclarationDate ?? row.declaration_date;
    const t = parseTimeMs(dateRaw as string | number | undefined);
    const state = rowString(row, "state", "State", "stateCode", "state_code");
    out.push({
      id: `fema-${num}`,
      title: state ? `${title} (${state})` : title,
      time: t,
      source: "FEMA",
      url,
    });
  }
  return out;
}

type NoaaFeature = {
  properties?: {
    id?: string;
    event?: string;
    headline?: string;
    web?: string;
    effective?: string;
    sent?: string;
  };
};

async function fetchNoaa(): Promise<DisasterFeedItem[]> {
  const res = await fetch(NOAA_ALERTS_URL, {
    ...FETCH_JSON,
    headers: {
      Accept: "application/geo+json",
      "User-Agent": JSON_HEADERS["User-Agent"],
    },
  });
  if (!res.ok) return [];
  const data = await res.json();
  const features: NoaaFeature[] = Array.isArray(data?.features)
    ? data.features
    : [];
  const out: DisasterFeedItem[] = [];
  for (const f of features) {
    const p = f.properties;
    const url = p?.web?.trim();
    if (!url || !url.startsWith("http")) continue;
    const headline = p?.headline?.trim() || p?.event?.trim() || "Weather alert";
    const id = p?.id || url;
    const time = parseTimeMs(p?.effective || p?.sent);
    out.push({
      id: `noaa-${String(id).slice(0, 120)}`,
      title: headline,
      time,
      source: "NWS",
      url,
    });
  }
  return out;
}

function dedupeByUrl(items: DisasterFeedItem[]): DisasterFeedItem[] {
  const seen = new Set<string>();
  const out: DisasterFeedItem[] = [];
  for (const it of items) {
    if (seen.has(it.url)) continue;
    seen.add(it.url);
    out.push(it);
  }
  return out;
}

/** Cap per source before mixing so FEMA / EONET are not buried under NWS volume. */
const PER_SOURCE_CAP = 20;

function takeRandomCap(items: DisasterFeedItem[], cap: number): DisasterFeedItem[] {
  return shuffle([...items]).slice(0, cap);
}

export async function GET() {
  try {
    const [usgs, eonet, fema, noaa] = await Promise.all([
      fetchUsgs(),
      fetchEonet(),
      fetchFema(),
      fetchNoaa(),
    ]);

    const u = usgs.filter(passesDisasterTheme);
    const e = eonet.filter(passesDisasterTheme);
    const f = fema.filter(passesDisasterTheme);
    const n = noaa.filter(passesDisasterTheme);

    const pooled = [
      ...takeRandomCap(u, PER_SOURCE_CAP),
      ...takeRandomCap(e, PER_SOURCE_CAP),
      ...takeRandomCap(f, PER_SOURCE_CAP),
      ...takeRandomCap(n, PER_SOURCE_CAP),
    ];
    const deduped = dedupeByUrl(pooled);
    const items = shuffle(deduped).slice(0, 60);

    return NextResponse.json(
      { items, updatedAt: Date.now() },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      },
    );
  } catch (e) {
    console.error("disaster-feed:", e);
    return NextResponse.json(
      { error: "Failed to load disaster feed", items: [] },
      { status: 500 },
    );
  }
}
