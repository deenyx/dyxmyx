export type AnalyticsEventName =
  | "video_selected"
  | "video_viewed"
  | "video_shared"
  | "ad_slot_rendered"
  | "vast_ad_attempted"
  | "vast_ad_started"
  | "vast_ad_finished"
  | "vast_ad_skipped";

export type AnalyticsEvent = {
  name: AnalyticsEventName;
  timestamp: string;
  pathname: string;
  payload?: Record<string, unknown>;
};

const STORAGE_KEY = "dyxmyx.localAnalytics";
const VIEW_COUNT_KEY = "dyxmyx.videoViews";
const MAX_EVENTS = 200;
const VIEW_COUNTS_UPDATED_EVENT = "dyxmyx:video-views-updated";

function readEvents(): AnalyticsEvent[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as AnalyticsEvent[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

function writeEvents(events: AnalyticsEvent[]) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(events.slice(-MAX_EVENTS)));
  } catch {
    // Ignore storage failures in private browsing or quota edge cases.
  }
}

export function trackLocalEvent(name: AnalyticsEventName, payload?: Record<string, unknown>) {
  if (typeof window === "undefined") return;

  const events = readEvents();
  events.push({
    name,
    timestamp: new Date().toISOString(),
    pathname: window.location.pathname,
    payload,
  });

  writeEvents(events);
}

type ViewCounts = Record<string, number>;

function readViewCounts(): ViewCounts {
  if (typeof window === "undefined") return {};

  try {
    const raw = window.localStorage.getItem(VIEW_COUNT_KEY);
    if (!raw) return {};

    const parsed = JSON.parse(raw) as Record<string, unknown>;
    if (!parsed || typeof parsed !== "object") return {};

    const normalized: ViewCounts = {};
    for (const [key, value] of Object.entries(parsed)) {
      if (typeof value === "number" && Number.isFinite(value) && value >= 0) {
        normalized[key] = Math.floor(value);
      }
    }

    return normalized;
  } catch {
    return {};
  }
}

function writeViewCounts(viewCounts: ViewCounts) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(VIEW_COUNT_KEY, JSON.stringify(viewCounts));
  } catch {
    // Ignore storage failures in private browsing or quota edge cases.
  }
}

function notifyViewCountsUpdated() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(VIEW_COUNTS_UPDATED_EVENT));
}

export function getVideoViewCountsSnapshot(): string {
  if (typeof window === "undefined") return "{}";
  return window.localStorage.getItem(VIEW_COUNT_KEY) ?? "{}";
}

export function subscribeVideoViewCounts(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const onStorage = (event: StorageEvent) => {
    if (event.key === VIEW_COUNT_KEY) {
      onStoreChange();
    }
  };

  const onUpdated = () => {
    onStoreChange();
  };

  window.addEventListener("storage", onStorage);
  window.addEventListener(VIEW_COUNTS_UPDATED_EVENT, onUpdated);

  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(VIEW_COUNTS_UPDATED_EVENT, onUpdated);
  };
}

export function getVideoViewCount(viewKey: string): number {
  const viewCounts = readViewCounts();
  return viewCounts[viewKey] ?? 0;
}

export function incrementVideoViewCounter(viewKey: string): number {
  const viewCounts = readViewCounts();
  const nextCount = (viewCounts[viewKey] ?? 0) + 1;
  viewCounts[viewKey] = nextCount;
  writeViewCounts(viewCounts);
  notifyViewCountsUpdated();
  return nextCount;
}
