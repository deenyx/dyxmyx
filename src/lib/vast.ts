import { VASTClient } from "@dailymotion/vast-client";

type VastMedia = {
  src: string;
  skipOffsetSeconds?: number;
  impressionUrls: string[];
  trackingCompleteUrls: string[];
};

function parseSkipOffset(raw: unknown): number | undefined {
  if (typeof raw === "number" && Number.isFinite(raw)) return raw;
  if (typeof raw !== "string") return undefined;

  const parts = raw.split(":").map(Number);
  if (parts.some((n) => Number.isNaN(n))) return undefined;

  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 1) return parts[0];
  return undefined;
}

function pickMediaFile(files: Array<{ fileURL?: string; mimeType?: string; delivery?: string }>) {
  const mp4 =
    files.find((f) => f.mimeType?.includes("mp4")) ??
    files.find((f) => f.fileURL?.includes(".mp4")) ??
    files.find((f) => f.delivery === "progressive") ??
    files[0];

  return mp4?.fileURL?.trim() ?? null;
}

export async function fetchVastPreRoll(vastTagUrl: string): Promise<VastMedia | null> {
  const client = new VASTClient();
  const response = await client.get(vastTagUrl);
  const ad = response.ads?.[0];
  if (!ad) return null;

  const creative = ad.creatives?.find(
    (item: { type?: string; mediaFiles?: unknown[] }) =>
      item.type === "linear" && Array.isArray(item.mediaFiles) && item.mediaFiles.length > 0,
  );

  if (!creative) return null;

  const src = pickMediaFile(creative.mediaFiles ?? []);
  if (!src) return null;

  const trackingEvents = creative.trackingEvents ?? {};
  const complete = trackingEvents.complete ?? [];

  return {
    src,
    skipOffsetSeconds: parseSkipOffset(creative.skipDelay),
    impressionUrls: ad.impressionURLTemplates ?? [],
    trackingCompleteUrls: Array.isArray(complete) ? complete : [complete].filter(Boolean),
  };
}

export function fireTrackingPixels(urls: string[]) {
  for (const url of urls) {
    if (!url) continue;
    const img = new Image();
    img.src = url;
  }
}
