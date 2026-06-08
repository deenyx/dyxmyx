"use client";

import { useEffect, useRef } from "react";
import type { ResolvedVideo } from "@/lib/types";
import { isEmbedKind, isNativeKind } from "@/lib/video";

export function VideoPlayer({ video }: { video: ResolvedVideo }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || video.kind !== "hls") return;

    if (el.canPlayType("application/vnd.apple.mpegurl")) {
      el.src = video.src;
      return;
    }

    let hls: { destroy: () => void } | null = null;

    import("hls.js").then(({ default: Hls }) => {
      if (!ref.current) return;
      if (Hls.isSupported()) {
        const instance = new Hls();
        instance.loadSource(video.src);
        instance.attachMedia(ref.current);
        hls = instance;
      }
    });

    return () => {
      hls?.destroy();
    };
  }, [video.kind, video.src]);

  if (isEmbedKind(video.kind)) {
    return (
      <div className="relative aspect-video overflow-hidden rounded-lg bg-neutral-900">
        <iframe
          src={video.src}
          title={video.title ?? "Video"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      </div>
    );
  }

  if (isNativeKind(video.kind)) {
    return (
      <video
        ref={ref}
        src={video.kind === "direct" ? video.src : undefined}
        poster={video.poster}
        controls
        playsInline
        preload="metadata"
        className="aspect-video w-full rounded-lg bg-neutral-900"
      />
    );
  }

  return null;
}
