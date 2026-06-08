"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import type { ProfileVideo, ResolvedVideo } from "@/lib/types";
import { AdBanner } from "@/components/ad-banner";
import { VastVideoPlayer } from "@/components/vast-video-player";

export type GalleryItem = {
  video: ProfileVideo;
  resolved: ResolvedVideo;
};

type Props = {
  items: GalleryItem[];
  modelName: string;
};

function formatLabel(item: GalleryItem, index: number): string {
  return item.video.title?.trim() || `Video ${index + 1}`;
}

export function VideoGallery({ items, modelName }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = items[activeIndex];

  const listItems = useMemo(
    () =>
      items.map((item, index) => ({
        ...item,
        index,
        label: formatLabel(item, index),
      })),
    [items],
  );

  if (!active) return null;

  return (
    <div className="space-y-6">
      <AdBanner slot="videos-header" className="mx-auto max-w-[728px]" />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,280px)_minmax(0,1fr)] lg:gap-8">
        <div className="space-y-3">
          <AdBanner slot="videos-list-top" className="w-full" />

          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
            {items.length} {items.length === 1 ? "video" : "videos"}
          </p>

          <ul className="max-h-[520px] space-y-2 overflow-y-auto pr-1">
            {listItems.map((item) => {
              const isActive = item.index === activeIndex;
              return (
                <li key={item.video.url}>
                  <button
                    type="button"
                    onClick={() => setActiveIndex(item.index)}
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
                      <p className="mt-1 text-[10px] uppercase tracking-wider text-neutral-500">
                        {item.resolved.kind}
                      </p>
                    </div>
                  </button>

                  {item.index !== items.length - 1 && (item.index + 1) % 3 === 0 && (
                    <div className="mt-2 hidden lg:block">
                      <AdBanner slot="videos-inline" slotInstance={`desktop-${item.index}`} className="w-full" />
                    </div>
                  )}

                  {item.index !== items.length - 1 && (item.index + 1) % 2 === 0 && (
                    <div className="mt-2 lg:hidden">
                      <AdBanner
                        slot="videos-mobile-inline"
                        slotInstance={`mobile-${item.index}`}
                        className="w-full"
                      />
                    </div>
                  )}
                </li>
              );
            })}
          </ul>

          <AdBanner slot="videos-list-bottom" className="w-full" />

          <AdBanner slot="videos-sidebar" className="hidden lg:block" />
        </div>

        <div className="min-w-0">
          <AdBanner slot="videos-player-top" className="mb-4 w-full" />

          <div className="mb-4">
            <h2 className="font-serif text-2xl tracking-wide text-neutral-50">
              {formatLabel(active, activeIndex)}
            </h2>
            <p className="mt-1 text-sm text-neutral-500">
              {modelName} · {active.resolved.kind.toUpperCase()}
            </p>
          </div>

          <VastVideoPlayer key={active.video.url} video={active.resolved} />

          <AdBanner slot="videos-player-bottom" className="mt-4 w-full" />
        </div>
      </div>

      <AdBanner slot="videos-footer" className="mx-auto max-w-[728px]" />
    </div>
  );
}
