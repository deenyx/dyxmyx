"use client";

import { useEffect, useRef } from "react";
import {
  adsConfig,
  bannerDivId,
  getBannerSnippet,
  getBannerZoneId,
  type AdBannerSlot,
} from "@/lib/ads";

type Props = {
  slot: AdBannerSlot;
  slotInstance?: string;
  label?: string;
  className?: string;
};

declare global {
  interface Window {
    AdProvider?: Array<Record<string, unknown>>;
    juicyads?: { adzone?: number };
  }
}

let providerLoaded = false;
const mountedZones = new Set<string>();

function loadProviderScript(src: string) {
  if (providerLoaded || typeof document === "undefined") return;
  const existing = document.querySelector(`script[data-dyx-ad-provider="true"]`);
  if (existing) {
    providerLoaded = true;
    return;
  }

  const script = document.createElement("script");
  script.src = src;
  script.async = true;
  script.dataset.dyxAdProvider = "true";
  document.head.appendChild(script);
  providerLoaded = true;
}

function mountExoClickZone(divId: string, zoneId: string) {
  window.AdProvider = window.AdProvider || [];
  window.AdProvider.push({
    serve: {
      divID: divId,
      position: zoneId.startsWith("zone_") ? zoneId : `zone_${zoneId}`,
    },
  });
}

function mountJuicyAdsZone(zoneId: string) {
  const zone = Number(zoneId);
  if (!Number.isFinite(zone)) return;

  window.juicyads = window.juicyads || {};
  window.juicyads.adzone = zone;

  const script = document.createElement("script");
  script.src = "https://adspace.juicyads.com/js/juicyads.js";
  script.async = true;
  document.body.appendChild(script);
}

export function AdBanner({ slot, slotInstance, label = "Advertisement", className = "" }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const divId = bannerDivId(slot, slotInstance);
  const snippet = getBannerSnippet(slot);
  const zoneId = getBannerZoneId(slot);

  useEffect(() => {
    if (!adsConfig.enabled) return;
    if (snippet && containerRef.current) {
      containerRef.current.innerHTML = snippet;
      containerRef.current.querySelectorAll("script").forEach((oldScript) => {
        const script = document.createElement("script");
        for (const attr of oldScript.attributes) {
          script.setAttribute(attr.name, attr.value);
        }
        script.text = oldScript.text;
        oldScript.replaceWith(script);
      });
      return;
    }

    if (!zoneId) return;

    const mountKey = `${adsConfig.network}:${divId}:${zoneId}`;
    if (mountedZones.has(mountKey)) return;

    if (adsConfig.network === "juicyads") {
      mountJuicyAdsZone(zoneId);
      mountedZones.add(mountKey);
      return;
    }

    loadProviderScript(adsConfig.providerScript);
    mountExoClickZone(divId, zoneId);
    mountedZones.add(mountKey);
  }, [divId, snippet, zoneId]);

  if (!adsConfig.enabled) return null;
  if (!snippet && !zoneId) return null;

  return (
    <aside
      aria-label={label}
      className={`overflow-hidden rounded-lg border border-neutral-800/80 bg-neutral-900/40 ${className}`}
    >
      <p className="px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-neutral-600">{label}</p>
      {snippet ? (
        <div ref={containerRef} className="min-h-[50px] p-2" />
      ) : (
        <div id={divId} className="min-h-[50px] p-2" />
      )}
    </aside>
  );
}
