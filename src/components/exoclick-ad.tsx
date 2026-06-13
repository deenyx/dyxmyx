"use client";

import { useEffect, useRef } from "react";

type Props = {
  zoneId: string;
  className?: string;
};

type AdProviderWindow = Window & {
  AdProvider?: Array<{ serve: Record<string, unknown> }>;
};

export function ExoClickAd({ zoneId, className = "" }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Load ad provider script if not already loaded
    if (!document.querySelector('script[src="https://a.magsrv.com/ad-provider.js"]')) {
      const script = document.createElement("script");
      script.async = true;
      script.type = "application/javascript";
      script.src = "https://a.magsrv.com/ad-provider.js";
      document.head.appendChild(script);
    }

    // Small delay to ensure ad provider is loaded
    setTimeout(() => {
      if (!containerRef.current) return;

      // Create ad container
      const ins = document.createElement("ins");
      ins.className = `eas6a97888e${zoneId}`;
      ins.setAttribute("data-zoneid", zoneId);
      containerRef.current.appendChild(ins);

      // Initialize ad
      const win = window as AdProviderWindow;
      win.AdProvider = win.AdProvider || [];
      win.AdProvider.push({ serve: {} });
    }, 100);
  }, [zoneId]);

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden ${className}`}
      style={{ minHeight: "90px" }}
    />
  );
}
