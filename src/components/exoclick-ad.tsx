"use client";

import { useEffect, useRef } from "react";

type Props = {
  zoneId: string;
  className?: string;
};

type AdProviderWindow = Window & {
  AdProvider?: Array<{ serve: Record<string, unknown> }>;
};

const zoneInsClass: Record<string, string> = {
  "5947824": "eas6a97888e2",
  "5947828": "eas6a97888e2",
  "5947826": "eas6a97888e10",
  "5947832": "eas6a97888e17",
  "5947842": "eas6a97888e37",
};

function getInsClass(zoneId: string) {
  return zoneInsClass[zoneId] ?? `eas6a97888e${zoneId}`;
}

export function ExoClickAd({ zoneId, className = "" }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Create ad container with the exact zone class expected by the provider.
    const ins = document.createElement("ins");
    ins.className = getInsClass(zoneId);
    ins.setAttribute("data-zoneid", zoneId);

    containerRef.current.innerHTML = "";
    containerRef.current.appendChild(ins);

    const script = document.createElement("script");
    script.async = true;
    script.type = "application/javascript";
    script.text = `(AdProvider = window.AdProvider || []).push({"serve": {}});`;
    containerRef.current.appendChild(script);
  }, [zoneId]);

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden rounded-3xl border border-neutral-800 bg-zinc-950 ${className}`}
      style={{ minHeight: "90px" }}
    >
      <div className="flex h-full items-center justify-center text-sm text-neutral-500">
        Loading advertisement...
      </div>
    </div>
  );
}
