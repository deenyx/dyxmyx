"use client";

import { useEffect, useRef } from "react";

type Props = {
  zoneId: string;
  className?: string;
};

export function ExoClickAd({ zoneId, className = "" }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mountedRef = useRef(false);

  useEffect(() => {
    if (mountedRef.current) return;
    if (!containerRef.current) return;

    mountedRef.current = true;

    // Load ad provider script if not already loaded
    if (!document.querySelector('script[src="https://a.magsrv.com/ad-provider.js"]')) {
      const script = document.createElement("script");
      script.async = true;
      script.type = "application/javascript";
      script.src = "https://a.magsrv.com/ad-provider.js";
      document.head.appendChild(script);
    }

    // Create ad container
    const ins = document.createElement("ins");
    ins.className = `eas6a97888e${zoneId}`;
    ins.setAttribute("data-zoneid", zoneId);
    containerRef.current.appendChild(ins);

    // Initialize ad
    (window as any).AdProvider = (window as any).AdProvider || [];
    (window as any).AdProvider.push({ serve: {} });
  }, [zoneId]);

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden ${className}`}
      style={{ minHeight: "50px" }}
    />
  );
}
