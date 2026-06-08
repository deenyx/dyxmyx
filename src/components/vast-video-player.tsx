"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ResolvedVideo } from "@/lib/types";
import { adsConfig } from "@/lib/ads";
import { fetchVastPreRoll, fireTrackingPixels } from "@/lib/vast";
import { isEmbedKind, isNativeKind } from "@/lib/video";
import { VideoPlayer } from "@/components/video-player";

type Phase = "idle" | "ad-loading" | "ad-playing" | "content";

type Props = {
  video: ResolvedVideo;
};

export function VastVideoPlayer({ video }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<{ destroy: () => void } | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [skipIn, setSkipIn] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const vastEnabled =
    adsConfig.enabled &&
    !!adsConfig.vastPreRollUrl &&
    isNativeKind(video.kind) &&
    !isEmbedKind(video.kind);

  const destroyHls = useCallback(() => {
    hlsRef.current?.destroy();
    hlsRef.current = null;
  }, []);

  const loadContent = useCallback(async () => {
    const el = videoRef.current;
    if (!el) return;

    destroyHls();
    setPhase("content");

    if (video.kind === "hls") {
      if (el.canPlayType("application/vnd.apple.mpegurl")) {
        el.src = video.src;
        await el.play().catch(() => undefined);
        return;
      }

      const { default: Hls } = await import("hls.js");
      if (Hls.isSupported()) {
        const instance = new Hls();
        instance.loadSource(video.src);
        instance.attachMedia(el);
        hlsRef.current = instance;
        await el.play().catch(() => undefined);
      }
      return;
    }

    el.src = video.src;
    await el.play().catch(() => undefined);
  }, [destroyHls, video.kind, video.src]);

  const playWithOptionalAd = useCallback(async () => {
    setError(null);

    if (!vastEnabled) {
      await loadContent();
      return;
    }

    setPhase("ad-loading");

    try {
      const ad = await fetchVastPreRoll(adsConfig.vastPreRollUrl);
      if (!ad) {
        await loadContent();
        return;
      }

      const el = videoRef.current;
      if (!el) return;

      fireTrackingPixels(ad.impressionUrls);
      el.src = ad.src;
      setPhase("ad-playing");

      if (ad.skipOffsetSeconds != null) {
        setSkipIn(ad.skipOffsetSeconds);
      } else {
        setSkipIn(null);
      }

      await el.play();
    } catch {
      await loadContent();
    }
  }, [loadContent, vastEnabled]);

  const skipAd = useCallback(async () => {
    const el = videoRef.current;
    if (!el) return;
    el.pause();
    el.removeAttribute("src");
    el.load();
    await loadContent();
  }, [loadContent]);

  useEffect(() => {
    return () => destroyHls();
  }, [destroyHls]);

  useEffect(() => {
    if (phase !== "ad-playing" || skipIn == null) return;

    if (skipIn <= 0) return;
    const timer = window.setInterval(() => {
      setSkipIn((value) => {
        if (value == null) return value;
        if (value <= 1) {
          window.clearInterval(timer);
          return 0;
        }
        return value - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [phase, skipIn]);

  if (isEmbedKind(video.kind)) {
    return <VideoPlayer video={video} />;
  }

  if (!isNativeKind(video.kind)) {
    return null;
  }

  return (
    <div className="relative overflow-hidden rounded-lg bg-neutral-900">
      <video
        ref={videoRef}
        poster={phase === "idle" ? video.poster : undefined}
        controls={phase === "content"}
        playsInline
        preload="metadata"
        className="aspect-video w-full bg-neutral-900"
        onEnded={() => {
          if (phase === "ad-playing") {
            void loadContent();
          }
        }}
        onClick={() => {
          if (phase === "idle") void playWithOptionalAd();
        }}
      />

      {phase === "idle" && (
        <button
          type="button"
          onClick={() => void playWithOptionalAd()}
          className="absolute inset-0 flex items-center justify-center bg-black/35 transition-colors hover:bg-black/45"
          aria-label={video.title ? `Play ${video.title}` : "Play video"}
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100/95 text-neutral-950">
            ▶
          </span>
        </button>
      )}

      {phase === "ad-loading" && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-xs uppercase tracking-widest text-neutral-300">
          Loading ad…
        </div>
      )}

      {phase === "ad-playing" && (
        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-3">
          <span className="rounded bg-black/70 px-2 py-1 text-[10px] uppercase tracking-widest text-neutral-300">
            Advertisement
          </span>
          {(skipIn == null || skipIn <= 0) && (
            <button
              type="button"
              onClick={() => void skipAd()}
              className="pointer-events-auto rounded bg-black/70 px-2 py-1 text-[10px] uppercase tracking-widest text-neutral-200 hover:text-white"
            >
              Skip ad
            </button>
          )}
          {skipIn != null && skipIn > 0 && (
            <span className="rounded bg-black/70 px-2 py-1 text-[10px] uppercase tracking-widest text-neutral-400">
              Skip in {skipIn}s
            </span>
          )}
        </div>
      )}

      {error && <p className="absolute bottom-3 left-3 text-xs text-red-300">{error}</p>}
    </div>
  );
}
