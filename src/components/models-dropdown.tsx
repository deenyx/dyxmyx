"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import type { Profile } from "@/lib/types";

export function ModelsDropdown({ profiles }: { profiles: Profile[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-lg bg-neutral-100 px-6 py-2 text-xs font-medium uppercase tracking-widest text-neutral-950 transition-opacity hover:opacity-90"
      >
        Models
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-lg border border-neutral-700 bg-neutral-900 shadow-lg">
          {profiles.map((profile) => (
            <Link
              key={profile.username}
              href={`/${profile.username}/bio`}
              className="block px-4 py-3 text-sm text-neutral-300 hover:bg-neutral-800 hover:text-neutral-100 first:rounded-t-lg last:rounded-b-lg"
              onClick={() => setIsOpen(false)}
            >
              {profile.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
