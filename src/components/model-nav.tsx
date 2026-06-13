"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { modelNav, modelSectionPath } from "@/lib/model-routes";
import type { ModelSection, Profile } from "@/lib/types";

function activeSection(pathname: string, username: string): ModelSection {
  const base = `/${username}`;
  if (pathname === base || pathname === `${base}/` || pathname.startsWith(`${base}/bio`)) {
    return "bio";
  }
  if (pathname.startsWith(`${base}/pyxs`)) return "pyxs";
  if (pathname.startsWith(`${base}/video`) || pathname.startsWith(`${base}/videos`)) {
    return "video";
  }
  if (pathname.startsWith(`${base}/wall`)) return "wall";
  if (pathname.startsWith(`${base}/contact`) || pathname.startsWith(`${base}/contactme`)) {
    return "contact";
  }
  return "bio";
}

export function ModelNav({ profile }: { profile: Profile }) {
  const pathname = usePathname();
  const active = activeSection(pathname, profile.username);

  return (
    <nav
      aria-label={`${profile.name} pages`}
      className="sticky top-0 z-10 border-b border-neutral-800/80 bg-neutral-950/95 backdrop-blur"
    >
      <div className="mx-auto flex max-w-4xl items-center gap-6 overflow-x-auto px-6 py-4">
        <Link
          href={modelSectionPath(profile.username, "bio")}
          className="flex shrink-0 items-center gap-3"
        >
          <div className="relative h-9 w-9 overflow-hidden rounded-full bg-neutral-800">
            <Image src={profile.avatar} alt="" fill className="object-cover" sizes="36px" />
          </div>
          <span className="font-serif text-sm tracking-wide text-neutral-100">{profile.name}</span>
        </Link>

        <div className="flex gap-1 sm:gap-2">
          {modelNav.map((item) => {
            const href = modelSectionPath(profile.username, item.section);
            const isActive = active === item.section;
            return (
              <Link
                key={item.section}
                href={href}
                className={`shrink-0 rounded-full px-3 py-1.5 text-xs uppercase tracking-wider transition-colors sm:px-4 ${
                  isActive
                    ? "bg-neutral-100 text-neutral-950"
                    : "text-neutral-500 hover:bg-neutral-800 hover:text-neutral-200"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <a
            href="https://paypal.me/fuxem"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 rounded-full px-3 py-1.5 text-xs uppercase tracking-wider transition-colors sm:px-4 bg-green-600 hover:bg-green-500 text-white"
          >
            Tip
          </a>
          <a
            href="https://paypal.me/fuxem"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 rounded-full px-3 py-1.5 text-xs uppercase tracking-wider transition-colors sm:px-4 border border-green-400 text-green-400 hover:bg-green-400/10"
          >
            Donate
          </a>
        </div>
      </div>
    </nav>
  );
}

export function ModelPageHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <header className="mb-10">
      <h1 className="font-serif text-3xl tracking-wide text-neutral-50 sm:text-4xl">{title}</h1>
      {description && (
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-neutral-500">{description}</p>
      )}
    </header>
  );
}
