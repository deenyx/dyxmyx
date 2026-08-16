"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { ProfileVideo, ResolvedVideo } from "@/lib/types";
import {
  getVideoViewCountsSnapshot,
  incrementVideoViewCounter,
  subscribeVideoViewCounts,
  trackLocalEvent,
} from "@/lib/analytics";
import { ExoClickAd } from "@/components/exoclick-ad";
import { VastVideoPlayer } from "@/components/vast-video-player";

const EXPERIMENTAL_LIST_TOP_ZONE =
  process.env.NEXT_PUBLIC_AD_ZONE_VIDEOS_LIST_TOP?.trim() ?? "";
const EXPERIMENTAL_PLAYER_TOP_ZONE =
  process.env.NEXT_PUBLIC_AD_ZONE_VIDEOS_PLAYER_TOP?.trim() ?? "";
const DEFAULT_LIST_ZONE = process.env.NEXT_PUBLIC_AD_ZONE_VIDEOS_LIST_PRIMARY?.trim() || "5947828";
const DEFAULT_PLAYER_ZONE = process.env.NEXT_PUBLIC_AD_ZONE_VIDEOS_PLAYER_PRIMARY?.trim() || "5947826";
const DEFAULT_FOOTER_DESKTOP_ZONE =
  process.env.NEXT_PUBLIC_AD_ZONE_VIDEOS_FOOTER_DESKTOP?.trim() || "5947832";
const DEFAULT_FOOTER_MOBILE_ZONE =
  process.env.NEXT_PUBLIC_AD_ZONE_VIDEOS_FOOTER_MOBILE?.trim() || "5967760";
const VIDEO_AD_EXPERIMENT_MODE =
  process.env.NEXT_PUBLIC_AD_VIDEO_EXPERIMENT?.trim().toLowerCase() ?? "off";
const PLAYER_TOP_EXPERIMENT_KEY = "dyxmyx.videos.playerTopExperiment.v1";
const PLAYER_TOP_EXPERIMENT_NAME = "videos_player_top_v1";

export type GalleryItem = {
  routeId: string;
  video: ProfileVideo;
  resolved: ResolvedVideo;
};

type Props = {
  items: GalleryItem[];
  modelName: string;
  basePath: string;
  activeVideoId?: string;
};

function formatLabel(item: GalleryItem, index: number): string {
  return item.video.title?.trim() || `Video ${index + 1}`;
}

function getRequestedIndex(searchParams: URLSearchParams, items: GalleryItem[]) {
  const rawValue = searchParams.get("video");
  if (!rawValue) return null;

  const parsedValue = Number.parseInt(rawValue, 10);
  if (Number.isInteger(parsedValue) && parsedValue >= 0 && parsedValue < items.length) {
    return parsedValue;
  }

  const decodedValue = decodeURIComponent(rawValue);
  const matchedIndex = items.findIndex((item) => item.video.url === decodedValue);
  return matchedIndex >= 0 ? matchedIndex : null;
}

function getPathVideoIndex(videoId: string | undefined, items: GalleryItem[]) {
  if (!videoId) return null;

  const byId = items.findIndex((item) => item.routeId === videoId);
  if (byId >= 0) return byId;

  const parsedValue = Number.parseInt(videoId, 10);
  if (!Number.isInteger(parsedValue) || parsedValue < 1 || parsedValue > items.length) {
    return null;
  }

  return parsedValue - 1;
}

function getVideoHref(basePath: string, item: GalleryItem) {
  return `${basePath}/${item.routeId}`;
}

function getViewKey(basePath: string, routeId: string) {
  return `${basePath}/${routeId}`;
}

function formatViews(count: number) {
  return `${count} ${count === 1 ? "view" : "views"}`;
}

export function VideoGallery({ items, modelName, basePath, activeVideoId }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const lastTrackedViewKeyRef = useRef<string | null>(null);
  const [playerTopVariant, setPlayerTopVariant] = useState<"control" | "player-top" | null>(
    VIDEO_AD_EXPERIMENT_MODE === "ab-player-top" ? null : "player-top",
  );
  const activeIndex = useMemo(() => {
    const pathIndex = getPathVideoIndex(activeVideoId, items);
    if (pathIndex != null) return pathIndex;
    return getRequestedIndex(searchParams, items);
  }, [activeVideoId, items, searchParams]);
  const [shareLabel, setShareLabel] = useState("Share");
  const viewCountsSnapshot = useSyncExternalStore(
    subscribeVideoViewCounts,
    getVideoViewCountsSnapshot,
    () => "{}",
  );
  const viewCounts = useMemo(() => {
    try {
      const parsed = JSON.parse(viewCountsSnapshot) as Record<string, unknown>;
      if (!parsed || typeof parsed !== "object") return {};

      const normalized: Record<string, number> = {};
      for (const [key, value] of Object.entries(parsed)) {
        if (typeof value === "number" && Number.isFinite(value) && value >= 0) {
          normalized[key] = Math.floor(value);
        }
      }
      return normalized;
    } catch {
      return {};
    }
  }, [viewCountsSnapshot]);

  const active = activeIndex == null ? null : items[activeIndex] ?? null;

  const listItems = useMemo(
    () =>
      items.map((item, index) => ({
        ...item,
        index,
        label: formatLabel(item, index),
      })),
    [items],
  );

  useEffect(() => {
    if (!active) return;

    const viewKey = getViewKey(basePath, active.routeId);
    if (lastTrackedViewKeyRef.current === viewKey) return;

    lastTrackedViewKeyRef.current = viewKey;
    const nextCount = incrementVideoViewCounter(viewKey);
    trackLocalEvent("video_viewed", {
      routeId: active.routeId,
      views: nextCount,
      modelName,
    });
  }, [active, basePath, modelName]);

  const handleSelectVideo = (index: number) => {
    const item = items[index];
    if (!item) return;

    trackLocalEvent("video_selected", {
      routeId: item.routeId,
      index,
      modelName,
    });
    router.replace(getVideoHref(basePath, item), { scroll: false });
  };

  const shareVideo = useCallback(async () => {
    if (!active) return;

    const shareUrl = `${window.location.origin}${getVideoHref(basePath, active)}`;
    const title = formatLabel(active, activeIndex ?? 0);

    try {
      if (typeof navigator !== "undefined" && "share" in navigator) {
        await navigator.share({
          title: `${modelName} — ${title}`,
          text: `Watch ${title} on ${modelName}'s page`,
          url: shareUrl,
        });
        setShareLabel("Shared");
        trackLocalEvent("video_shared", {
          routeId: active.routeId,
          method: "native-share",
        });
      } else {
        const clipboard = (navigator as Navigator & { clipboard?: { writeText: (value: string) => Promise<void> } }).clipboard;
        if (clipboard?.writeText) {
          await clipboard.writeText(shareUrl);
          setShareLabel("Link copied");
          trackLocalEvent("video_shared", {
            routeId: active.routeId,
            method: "clipboard",
          });
        } else {
          setShareLabel("Share unavailable");
          trackLocalEvent("video_shared", {
            routeId: active.routeId,
            method: "unsupported",
          });
        }
      }
    } catch {
      const clipboard = (navigator as Navigator & { clipboard?: { writeText: (value: string) => Promise<void> } }).clipboard;
      if (clipboard?.writeText) {
        try {
          await clipboard.writeText(shareUrl);
          setShareLabel("Link copied");
          trackLocalEvent("video_shared", {
            routeId: active.routeId,
            method: "clipboard-fallback",
          });
        } catch {
          setShareLabel("Share unavailable");
          trackLocalEvent("video_shared", {
            routeId: active.routeId,
            method: "error",
          });
        }
      } else {
        setShareLabel("Share unavailable");
        trackLocalEvent("video_shared", {
          routeId: active.routeId,
          method: "error",
        });
      }
    }

    window.setTimeout(() => setShareLabel("Share"), 1800);
  }, [active, activeIndex, basePath, modelName]);

  useEffect(() => {
    if (VIDEO_AD_EXPERIMENT_MODE !== "ab-player-top") return;
    if (!EXPERIMENTAL_PLAYER_TOP_ZONE || EXPERIMENTAL_PLAYER_TOP_ZONE === "5947826") {
      queueMicrotask(() => setPlayerTopVariant("control"));
      return;
    }

    try {
      const storedVariant = window.localStorage.getItem(PLAYER_TOP_EXPERIMENT_KEY);
      if (storedVariant === "control" || storedVariant === "player-top") {
        queueMicrotask(() => setPlayerTopVariant(storedVariant));
        return;
      }

      const assignedVariant = Math.random() < 0.5 ? "control" : "player-top";
      window.localStorage.setItem(PLAYER_TOP_EXPERIMENT_KEY, assignedVariant);
      queueMicrotask(() => setPlayerTopVariant(assignedVariant));
      trackLocalEvent("ad_experiment_assigned", {
        experiment: PLAYER_TOP_EXPERIMENT_NAME,
        variant: assignedVariant,
      });
    } catch {
      queueMicrotask(() => setPlayerTopVariant("control"));
    }
  }, []);

  const showExperimentalPlayerTop =
    !!EXPERIMENTAL_PLAYER_TOP_ZONE &&
    EXPERIMENTAL_PLAYER_TOP_ZONE !== "5947826" &&
    playerTopVariant === "player-top";

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,280px)_minmax(0,1fr)] lg:gap-8">
        <div className="space-y-3">
          {EXPERIMENTAL_LIST_TOP_ZONE && EXPERIMENTAL_LIST_TOP_ZONE !== "5947828" && (
            <ExoClickAd zoneId={EXPERIMENTAL_LIST_TOP_ZONE} size="compact" className="w-full" />
          )}
          <ExoClickAd zoneId={DEFAULT_LIST_ZONE} size="compact" className="w-full" />

          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
            {items.length} {items.length === 1 ? "video" : "videos"}
          </p>

          <ul className="space-y-2">
              {listItems.map((item) => {
                const isActive = activeIndex != null && item.index === activeIndex;
              return (
                <li key={item.routeId}>
                  <button
                    type="button"
                    onClick={() => handleSelectVideo(item.index)}
                    className={`flex w-full gap-3 rounded-xl border p-2 text-left transition-colors ${
                      isActive
                        ? "border-neutral-500 bg-neutral-900"
                        : "border-neutral-800 bg-neutral-900/30 hover:border-neutral-700"
                    }`}
                  >
                    <div className="relative h-16 w-28 shrink-0 overflow-hidden rounded-lg bg-neutral-800">
                      {item.video.poster ? (
                        <Image
                          src={item.video.poster}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="112px"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-[10px] uppercase tracking-widest text-neutral-600">
                          No poster
                        </div>
                      )}
                      {isActive && (
                        <span className="absolute inset-0 flex items-center justify-center bg-black/45 text-[10px] uppercase tracking-widest text-neutral-100">
                          Now playing
                        </span>
                      )}
                    </div>

                    <div className="min-w-0 py-1">
                      <p className="truncate text-sm font-medium text-neutral-200">{item.label}</p>
                      {isActive && (
                        <p className="mt-1 text-[10px] uppercase tracking-wider text-pink-300">Selected</p>
                      )}
                      <p className="mt-1 text-[10px] uppercase tracking-wider text-neutral-500">
                        {item.resolved.kind} · {formatViews(viewCounts[getViewKey(basePath, item.routeId)] ?? 0)}
                      </p>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="min-w-0">
          {showExperimentalPlayerTop && (
            <ExoClickAd zoneId={EXPERIMENTAL_PLAYER_TOP_ZONE} size="compact" className="mb-4 w-full" />
          )}
          {active ? (
            <>
              <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-serif text-2xl tracking-wide text-neutral-50">
                    {formatLabel(active, activeIndex ?? 0)}
                  </h2>
                  <p className="mt-1 text-sm text-neutral-500">
                    {modelName} · {active.resolved.kind.toUpperCase()}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-wider text-neutral-500">
                    {formatViews(viewCounts[getViewKey(basePath, active.routeId)] ?? 0)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => void shareVideo()}
                  className="rounded-full border border-neutral-700 bg-neutral-900/80 px-3 py-1.5 text-sm text-neutral-200 transition-colors hover:border-neutral-500 hover:text-white"
                >
                  {shareLabel}
                </button>
              </div>

              <VastVideoPlayer key={active.routeId} video={active.resolved} />
            </>
          ) : (
            <div className="rounded-xl border border-dashed border-neutral-800 bg-neutral-900/20 px-6 py-16 text-center">
              <p className="font-serif text-xl tracking-wide text-neutral-100">Pick a video to start watching</p>
              <p className="mt-3 text-sm text-neutral-500">
                No video is loaded automatically on this page.
              </p>
            </div>
          )}

          <ExoClickAd zoneId={DEFAULT_PLAYER_ZONE} className="mt-4 w-full" />
        </div>
      </div>

      <ExoClickAd zoneId={DEFAULT_FOOTER_DESKTOP_ZONE} size="compact" className="mx-auto hidden md:block" />
      <ExoClickAd zoneId={DEFAULT_FOOTER_MOBILE_ZONE} className="mx-auto mt-4 w-full max-w-[320px] md:hidden" />
    </div>
  );
}
