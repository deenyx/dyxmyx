"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { adsConfig } from "@/lib/ads";
import { trackLocalEvent } from "@/lib/analytics";

type Props = {
  zoneId: string;
  className?: string;
  size?: "default" | "compact";
};

declare global {
  interface Window {
    AdProvider?: Array<Record<string, unknown>>;
  }
}

const zoneInsClass: Record<string, string> = {
  "5947824": "eas6a97888e2",
  "5947828": "eas6a97888e2",
  "5947826": "eas6a97888e10",
  "5947832": "eas6a97888e17",
  "5947842": "eas6a97888e37",
  "5967756": "eas6a97888e38",
  "5967758": "eas6a97888e2",
  "5967760": "eas6a97888e10",
};

let providerScriptRequested = false;

function getInsClass(zoneId: string) {
  return zoneInsClass[zoneId] ?? `eas6a97888e${zoneId}`;
}

type AdState = "loading" | "ready" | "failed";

const zoneLayoutConfig: Record<
  string,
  {
    maxWidth: string;
    defaultMinHeight: string;
    compactMinHeight: string;
  }
> = {
  "5947824": {
    maxWidth: "100%",
    defaultMinHeight: "clamp(280px, 55vw, 720px)",
    compactMinHeight: "clamp(220px, 50vw, 640px)",
  },
  "5947828": {
    maxWidth: "728px",
    defaultMinHeight: "clamp(90px, 14vw, 180px)",
    compactMinHeight: "clamp(72px, 12vw, 140px)",
  },
  "5947826": {
    maxWidth: "100%",
    defaultMinHeight: "clamp(220px, 48vw, 640px)",
    compactMinHeight: "clamp(180px, 42vw, 520px)",
  },
  "5947832": {
    maxWidth: "728px",
    defaultMinHeight: "clamp(90px, 14vw, 180px)",
    compactMinHeight: "clamp(72px, 12vw, 140px)",
  },
  "5947842": {
    maxWidth: "100%",
    defaultMinHeight: "clamp(220px, 48vw, 640px)",
    compactMinHeight: "clamp(180px, 42vw, 520px)",
  },
  "5967756": {
    maxWidth: "100%",
    defaultMinHeight: "clamp(220px, 48vw, 640px)",
    compactMinHeight: "clamp(180px, 42vw, 520px)",
  },
  "5967758": {
    maxWidth: "728px",
    defaultMinHeight: "clamp(90px, 14vw, 180px)",
    compactMinHeight: "clamp(72px, 12vw, 140px)",
  },
  "5967760": {
    maxWidth: "320px",
    defaultMinHeight: "clamp(90px, 28vw, 160px)",
    compactMinHeight: "clamp(72px, 24vw, 130px)",
  },
};

function getZoneLayout(zoneId: string, size: "default" | "compact") {
  const fallback = {
    maxWidth: "100%",
    defaultMinHeight: "clamp(90px, 16vw, 220px)",
    compactMinHeight: "clamp(72px, 12vw, 160px)",
  };
  const config = zoneLayoutConfig[zoneId] ?? fallback;

  return {
    maxWidth: config.maxWidth,
    minHeight: size === "compact" ? config.compactMinHeight : config.defaultMinHeight,
  };
}

export function ExoClickAd({ zoneId, className = "", size = "default" }: Props) {
  const normalizedZoneId = zoneId.trim();
  const containerRef = useRef<HTMLDivElement>(null);
  const viewTrackedRef = useRef(false);
  const clickTrackedRef = useRef(false);
  const pointerDownAtRef = useRef(0);
  const statusRef = useRef<AdState>("loading");
  const [status, setStatus] = useState<AdState>("loading");
  const layout = getZoneLayout(normalizedZoneId, size);

  const updateStatus = useCallback((nextStatus: AdState) => {
    if (statusRef.current === nextStatus) return;
    statusRef.current = nextStatus;
    setStatus(nextStatus);
  }, [setStatus]);

  useEffect(() => {
    if (!adsConfig.enabled || adsConfig.network !== "exoclick") return;
    if (!normalizedZoneId) return;

    const container = containerRef.current;
    if (!container) return;

    viewTrackedRef.current = false;
    clickTrackedRef.current = false;
    pointerDownAtRef.current = 0;
    updateStatus("loading");

    // Create ad container with the exact zone class expected by the provider.
    const ins = document.createElement("ins");
    ins.className = getInsClass(normalizedZoneId);
    ins.setAttribute("data-zoneid", normalizedZoneId);
    ins.style.display = "block";
    ins.style.width = "100%";

    container.innerHTML = "";
    container.appendChild(ins);

    const script = document.createElement("script");
    script.async = true;
    script.type = "application/javascript";
    script.text = `(AdProvider = window.AdProvider || []).push({"serve": {}});`;
    container.appendChild(script);

    const existingProvider = document.querySelector(
      `script[data-dyx-exoclick-provider="true"],script[src="${adsConfig.providerScript}"]`,
    );
    if (existingProvider) {
      providerScriptRequested = true;
    }

    if (!providerScriptRequested) {
      const providerScript = document.createElement("script");
      providerScript.src = adsConfig.providerScript;
      providerScript.async = true;
      providerScript.dataset.dyxExoclickProvider = "true";
      providerScript.onerror = () => {
        setStatus("failed");
        trackLocalEvent("ad_slot_failed", {
          zoneId: normalizedZoneId,
          network: adsConfig.network,
          reason: "provider-script-error",
        });
      };
      document.head.appendChild(providerScript);
      providerScriptRequested = true;
    }

    trackLocalEvent("ad_slot_rendered", {
      zoneId: normalizedZoneId,
      network: adsConfig.network,
      size,
    });

    const markReady = (source: "observer" | "timer") => {
      if (statusRef.current === "ready") return;
      updateStatus("ready");
      trackLocalEvent("ad_slot_loaded", {
        zoneId: normalizedZoneId,
        network: adsConfig.network,
        source,
      });
    };

    const mutationObserver =
      typeof MutationObserver === "undefined"
        ? null
        : new MutationObserver(() => {
            const iframe = container.querySelector("iframe");
            const media = container.querySelector("img, a");
            if (iframe) {
              iframe.style.width = "100%";
              iframe.style.maxWidth = "100%";
              iframe.style.border = "0";
              markReady("observer");
              return;
            }

            if (media) {
              markReady("observer");
            }
          });

    mutationObserver?.observe(container, { childList: true, subtree: true, attributes: true });

    const handlePointerDown = () => {
      pointerDownAtRef.current = Date.now();
    };

    const handleWindowBlur = () => {
      if (clickTrackedRef.current) return;
      const elapsed = Date.now() - pointerDownAtRef.current;
      if (elapsed < 0 || elapsed > 1500) return;

      clickTrackedRef.current = true;
      trackLocalEvent("ad_slot_clicked", {
        zoneId: normalizedZoneId,
        network: adsConfig.network,
        inferred: true,
      });
    };

    container.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("blur", handleWindowBlur);

    const fallbackTimer = window.setTimeout(() => {
      const hasRenderableContent = container.querySelector("iframe, img, a") != null;
      if (!hasRenderableContent) {
        updateStatus("failed");
        trackLocalEvent("ad_slot_failed", {
          zoneId: normalizedZoneId,
          network: adsConfig.network,
          reason: "no-rendered-content",
        });
        return;
      }

      markReady("timer");
    }, 3000);

    const observer =
      typeof IntersectionObserver === "undefined"
        ? null
        : new IntersectionObserver(
            (entries) => {
              const entry = entries[0];
              if (!entry || viewTrackedRef.current || !entry.isIntersecting || entry.intersectionRatio < 0.45) {
                return;
              }

              viewTrackedRef.current = true;
              trackLocalEvent("ad_slot_viewable", {
                zoneId: normalizedZoneId,
                network: adsConfig.network,
                status: statusRef.current,
              });
            },
            { threshold: [0.45] },
          );

    if (observer) observer.observe(container);

    return () => {
      window.clearTimeout(fallbackTimer);
      mutationObserver?.disconnect();
      container.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("blur", handleWindowBlur);
      observer?.disconnect();
    };
  }, [normalizedZoneId, size, updateStatus]);

  if (!adsConfig.enabled || adsConfig.network !== "exoclick") {
    return null;
  }

  if (!normalizedZoneId) return null;

  return (
    <div
      className={`relative w-full overflow-hidden rounded-3xl border border-neutral-800 bg-zinc-950 ${className}`}
      style={{
        minHeight: layout.minHeight,
        maxWidth: layout.maxWidth,
        marginInline: "auto",
      }}
    >
      <div ref={containerRef} className="h-full w-full" />
      {status !== "ready" && (
        <div
          className={`pointer-events-none absolute inset-0 flex items-center justify-center px-3 text-center text-neutral-500 ${
            size === "compact" ? "text-xs" : "text-sm"
          }`}
        >
          {status === "failed" ? "Advertisement unavailable" : "Loading advertisement..."}
        </div>
      )}
    </div>
  );
}
