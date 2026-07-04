"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ResolvedVideo } from "@/lib/types";
import { adsConfig } from "@/lib/ads";
import { trackLocalEvent } from "@/lib/analytics";
import { fetchVastPreRoll, fireTrackingPixels, VastError } from "@/lib/vast";
import { isEmbedKind, isNativeKind } from "@/lib/video";
import { VideoPlayer } from "@/components/video-player";

type Phase = "idle" | "ad-loading" | "ad-playing" | "content";

type Props = {
  video: ResolvedVideo;
};

const MAX_AD_PLAYBACK_MS = 45000;
const NOTICE_TIMEOUT_MS = 4200;

function getVastFallbackMessage(error: unknown) {
  if (error instanceof VastError) {
    if (error.code === "fetch-failed") return "Ad server unavailable; playing content";
    if (error.code === "no-linear-creative") return "Ad format unsupported; playing content";
    if (error.code === "no-playable-media") return "Ad media unavailable; playing content";
    return "Ad unavailable; playing content";
  }

  return "Ad error; playing content";
}

export function VastVideoPlayer({ video }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<{ destroy: () => void } | null>(null);
  const phaseRef = useRef<Phase>("idle");
  const adTransitioningRef = useRef(false);
  const currentAdRef = useRef<Awaited<ReturnType<typeof fetchVastPreRoll>>>(null);
  const adSkipEndsAtRef = useRef<number | null>(null);
  const skipTimerRef = useRef<number | null>(null);
  const adEndTimerRef = useRef<number | null>(null);
  const noticeTimerRef = useRef<number | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [skipIn, setSkipIn] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const clearSkipTimer = useCallback(() => {
    if (skipTimerRef.current != null) {
      window.clearInterval(skipTimerRef.current);
      skipTimerRef.current = null;
    }
  }, []);

  const clearAdEndTimer = useCallback(() => {
    if (adEndTimerRef.current != null) {
      window.clearTimeout(adEndTimerRef.current);
      adEndTimerRef.current = null;
    }
  }, []);

  const clearNoticeTimer = useCallback(() => {
    if (noticeTimerRef.current != null) {
      window.clearTimeout(noticeTimerRef.current);
      noticeTimerRef.current = null;
    }
  }, []);

  const showFallbackNotice = useCallback(
    (message: string) => {
      clearNoticeTimer();
      setError(message);
      noticeTimerRef.current = window.setTimeout(() => {
        setError(null);
        noticeTimerRef.current = null;
      }, NOTICE_TIMEOUT_MS);
    },
    [clearNoticeTimer],
  );

  const clearPlaybackTimers = useCallback(() => {
    clearSkipTimer();
    clearAdEndTimer();
  }, [clearAdEndTimer, clearSkipTimer]);

  const setPhaseAndRef = useCallback((nextPhase: Phase) => {
    phaseRef.current = nextPhase;
    setPhase(nextPhase);
  }, []);

  const vastEnabled =
    adsConfig.enabled &&
    !!adsConfig.vastPreRollUrl &&
    (video.kind === "bunny" || isNativeKind(video.kind));

  const destroyHls = useCallback(() => {
    hlsRef.current?.destroy();
    hlsRef.current = null;
  }, []);

  const loadContent = useCallback(async () => {
    const el = videoRef.current;
    if (!el) return;

    clearPlaybackTimers();
    currentAdRef.current = null;
    adSkipEndsAtRef.current = null;
    adTransitioningRef.current = false;
    setSkipIn(null);

    destroyHls();
    setPhaseAndRef("content");

    try {
      el.pause();
    } catch {
      // ignore
    }
    el.removeAttribute("src");
    el.load();

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
  }, [clearPlaybackTimers, destroyHls, setPhaseAndRef, video.kind, video.src]);

  const finishAdPlayback = useCallback(
    async (reason: "ended" | "skip" | "timeout" | "error" = "timeout") => {
      if (adTransitioningRef.current) return;
      adTransitioningRef.current = true;

      try {
        const currentAd = currentAdRef.current;
        currentAdRef.current = null;
        clearPlaybackTimers();
        adSkipEndsAtRef.current = null;
        setSkipIn(null);

        if (reason === "ended" && currentAd?.trackingCompleteUrls?.length) {
          fireTrackingPixels(currentAd.trackingCompleteUrls);
        }

        trackLocalEvent("vast_ad_finished", {
          reason,
          completeTracked: reason === "ended" && Boolean(currentAd?.trackingCompleteUrls?.length),
        });

        setPhaseAndRef("content");
        await loadContent();
      } finally {
        adTransitioningRef.current = false;
      }
    },
    [clearPlaybackTimers, loadContent, setPhaseAndRef],
  );

  const startAdEndTimeout = useCallback(
    (durationMs: number) => {
      clearAdEndTimer();
      adEndTimerRef.current = window.setTimeout(() => {
        if (phaseRef.current !== "ad-playing") return;
        void finishAdPlayback("timeout");
      }, Math.max(1000, durationMs));
    },
    [clearAdEndTimer, finishAdPlayback],
  );

  const playWithOptionalAd = useCallback(async () => {
    clearPlaybackTimers();
    currentAdRef.current = null;
    adSkipEndsAtRef.current = null;
    adTransitioningRef.current = false;
    setSkipIn(null);
    clearNoticeTimer();
    setError(null);

    if (!vastEnabled) {
      await loadContent();
      return;
    }

    trackLocalEvent("vast_ad_attempted", {
      videoKind: video.kind,
    });

    setPhaseAndRef("ad-loading");

    try {
      const timeoutMs = 5000;
      const ad = await Promise.race([
        fetchVastPreRoll(adsConfig.vastPreRollUrl),
        new Promise<null>((resolve) => setTimeout(() => resolve(null), timeoutMs)),
      ]);

      if (!ad) {
        showFallbackNotice("Ad unavailable; playing content");
        await loadContent();
        return;
      }

      const el = videoRef.current;
      if (!el) return;

      try {
        el.pause();
      } catch {
        // ignore
      }
      el.removeAttribute("src");
      el.load();

      fireTrackingPixels(ad.impressionUrls);
      currentAdRef.current = ad;
      trackLocalEvent("vast_ad_started", {
        hasSkipOffset: ad.skipOffsetSeconds != null,
      });

      el.src = ad.src;
      setPhaseAndRef("ad-playing");
      startAdEndTimeout(MAX_AD_PLAYBACK_MS);

      if (ad.skipOffsetSeconds != null && Number.isFinite(ad.skipOffsetSeconds)) {
        const endsAt = Date.now() + ad.skipOffsetSeconds * 1000;
        adSkipEndsAtRef.current = endsAt;

        const tick = () => {
          const now = Date.now();
          const remaining = Math.ceil((endsAt - now) / 1000);
          setSkipIn(remaining <= 0 ? 0 : remaining);
          if (remaining <= 0) clearSkipTimer();
        };

        tick();
        skipTimerRef.current = window.setInterval(tick, 250);
      } else {
        setSkipIn(null);
      }

      await el.play().catch(async () => {
        showFallbackNotice("Ad failed to play; playing content");
        await finishAdPlayback("error");
      });
    } catch (caughtError) {
      showFallbackNotice(getVastFallbackMessage(caughtError));
      await loadContent();
    }
  }, [
    clearNoticeTimer,
    clearPlaybackTimers,
    clearSkipTimer,
    finishAdPlayback,
    loadContent,
    setPhaseAndRef,
    showFallbackNotice,
    startAdEndTimeout,
    vastEnabled,
    video.kind,
  ]);

  const skipAd = useCallback(async () => {
    trackLocalEvent("vast_ad_skipped");
    await finishAdPlayback("skip");
  }, [finishAdPlayback]);

  useEffect(() => {
    return () => {
      clearPlaybackTimers();
      clearNoticeTimer();
      destroyHls();
      currentAdRef.current = null;
    };
  }, [clearNoticeTimer, clearPlaybackTimers, destroyHls]);

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
        onLoadedMetadata={() => {
          if (phaseRef.current !== "ad-playing") return;

          const el = videoRef.current;
          if (!el || !Number.isFinite(el.duration) || el.duration <= 0) return;

          startAdEndTimeout(Math.min(MAX_AD_PLAYBACK_MS, Math.ceil(el.duration * 1000) + 800));
        }}
        onEnded={() => {
          if (phaseRef.current === "ad-playing") {
            void finishAdPlayback("ended");
          }
        }}
        onError={() => {
          if (phaseRef.current === "ad-playing") {
            showFallbackNotice("Ad playback failed; playing content");
            void finishAdPlayback("error");
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

      {error && (
        <p className="absolute bottom-3 left-3 text-xs text-red-300">
          {error}
        </p>
      )}
    </div>
  );
}
