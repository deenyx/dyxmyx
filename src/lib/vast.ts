import { VASTClient } from "@dailymotion/vast-client";

type VastMedia = {
  src: string;
  skipOffsetSeconds?: number;
  impressionUrls: string[];
  trackingCompleteUrls: string[];
};

export type VastErrorCode =
  | "fetch-failed"
  | "invalid-vast"
  | "no-linear-creative"
  | "no-playable-media";

export class VastError extends Error {
  constructor(
    public readonly code: VastErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "VastError";
  }
}

type VastFile = {
  fileURL?: string;
  mimeType?: string;
  delivery?: string;
  type?: string;
  width?: number | string;
  height?: number | string;
  bitrate?: number | string;
};

type VastCreative = {
  type?: string;
  skipDelay?: unknown;
  mediaFiles?: VastFile[];
  trackingEvents?: Record<string, unknown>;
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

function resolveUrl(url: string, baseUrl: string): string {
  if (!url) return "";

  try {
    return new URL(url, baseUrl).toString();
  } catch {
    return url;
  }
}

function toAbsoluteUrl(value: string): string {
  if (!value) return "";

  try {
    if (typeof window !== "undefined") {
      return new URL(value, window.location.href).toString();
    }

    return new URL(value, "http://localhost").toString();
  } catch {
    return value;
  }
}

function toNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
}

function toTrackingUrlList(raw: unknown, baseUrl: string): string[] {
  const values = Array.isArray(raw) ? raw : [raw];
  return values
    .filter((value): value is string => typeof value === "string" && value.trim().length > 0)
    .map((value) => resolveUrl(value.trim(), baseUrl));
}

function pickMediaFile(files: VastFile[], baseUrl: string) {
  const targetHeight = 720;
  const targetBitrate = 1500;

  const normalized = files
    .map((f, index) => {
      const url = f.fileURL?.trim() ?? "";
      const resolvedUrl = resolveUrl(url, baseUrl);
      const mime = f.mimeType?.toLowerCase() ?? "";
      const delivery = (f.delivery ?? "").toLowerCase();
      const type = (f.type ?? "").toLowerCase();
      const height = toNumber(f.height);
      const bitrate = toNumber(f.bitrate);

      const isMp4 = mime.includes("mp4") || resolvedUrl.includes(".mp4") || type.includes("mp4");
      const isProgressive = delivery === "progressive";
      const isHttp = resolvedUrl.startsWith("http://") || resolvedUrl.startsWith("https://");

      let score = 0;
      if (isProgressive) score += 60;
      if (isMp4) score += 40;
      if (isHttp) score += 20;
      if (height != null) score += Math.max(0, 20 - Math.floor(Math.abs(height - targetHeight) / 80));
      if (bitrate != null) score += Math.max(0, 15 - Math.floor(Math.abs(bitrate - targetBitrate) / 180));

      return {
        url: resolvedUrl,
        isMp4,
        isProgressive,
        height,
        bitrate,
        score,
        index,
      };
    })
    .filter((x) => x.url);

  const preferred = normalized
    .slice()
    .sort(
      (a, b) =>
        b.score - a.score ||
        Number(b.isProgressive) - Number(a.isProgressive) ||
        Number(b.isMp4) - Number(a.isMp4) ||
        a.index - b.index,
    )[0];

  return preferred?.url ?? null;
}

export async function fetchVastPreRoll(vastTagUrl: string): Promise<VastMedia | null> {
  const client = new VASTClient();
  const absoluteVastUrl = toAbsoluteUrl(vastTagUrl);
  let response: Awaited<ReturnType<VASTClient["get"]>>;

  try {
    response = await client.get(absoluteVastUrl || vastTagUrl);
  } catch {
    throw new VastError("fetch-failed", "Unable to fetch VAST response");
  }

  if (!response || !Array.isArray(response.ads)) {
    throw new VastError("invalid-vast", "Malformed VAST response");
  }

  const ad = response.ads?.[0];
  if (!ad) return null;

  const creative = ad.creatives?.find(
    (item: VastCreative) =>
      item.type === "linear" && Array.isArray(item.mediaFiles) && item.mediaFiles.length > 0,
  ) as VastCreative | undefined;

  if (!creative) {
    throw new VastError("no-linear-creative", "No playable linear creative in VAST response");
  }

  const src = pickMediaFile(creative.mediaFiles ?? [], absoluteVastUrl || vastTagUrl);
  if (!src) {
    throw new VastError("no-playable-media", "No playable media file in VAST response");
  }

  const trackingEvents = creative.trackingEvents ?? {};
  const complete = trackingEvents.complete ?? [];
  const impressionUrls = toTrackingUrlList(ad.impressionURLTemplates, absoluteVastUrl || vastTagUrl);
  const trackingCompleteUrls = toTrackingUrlList(complete, absoluteVastUrl || vastTagUrl);

  return {
    src,
    skipOffsetSeconds: parseSkipOffset(creative.skipDelay),
    impressionUrls,
    trackingCompleteUrls,
  };
}

export function fireTrackingPixels(urls: string[]) {
  for (const url of urls) {
    if (!url) continue;
    const img = new Image();
    img.src = url;
  }
}
