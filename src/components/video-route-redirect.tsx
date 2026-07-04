"use client";

import { useEffect } from "react";

function toCanonicalVideosPath(pathname: string) {
  return pathname.replace(/\/video(\/|$)/, "/videos$1");
}

export function VideoRouteRedirect() {
  useEffect(() => {
    const nextPath = toCanonicalVideosPath(window.location.pathname);
    const nextUrl = `${nextPath}${window.location.search}${window.location.hash}`;
    window.location.replace(nextUrl);
  }, []);

  return (
    <main className="mx-auto flex min-h-[40vh] max-w-3xl items-center justify-center px-6 py-16 text-center">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-neutral-500">Redirecting</p>
        <h1 className="mt-3 font-serif text-3xl text-neutral-50">Moving to the videos page</h1>
        <p className="mt-3 text-neutral-400">This route now lives at /videos.</p>
      </div>
    </main>
  );
}