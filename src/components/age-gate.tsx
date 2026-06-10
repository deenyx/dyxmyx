"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { legalLinks, site } from "@/lib/site";

export function AgeGate() {
  const router = useRouter();

  useEffect(() => {
    const verified = document.cookie
      .split(";")
      .some((c) => c.trim().startsWith("age-verified=true"));
    if (verified) router.replace("/welcome");
  }, [router]);

  function handleEnter() {
    document.cookie = `age-verified=true; max-age=${60 * 60 * 24 * 30}; path=/; SameSite=None; Secure`;
    router.push("/welcome");
  }
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-lg text-center">
        <div className="mx-auto mb-8 flex h-14 w-14 items-center justify-center rounded-full border border-red-500/40 bg-red-500/10">
          <span className="text-sm font-semibold tracking-tight text-red-400">18+</span>
        </div>

        <p className="text-xs uppercase tracking-[0.35em] text-red-400/90">Adults only</p>
        <h1 className="mt-5 font-serif text-4xl tracking-wide text-neutral-50 sm:text-5xl">
          {site.name}
        </h1>

        <div className="mt-8 space-y-4 text-sm leading-relaxed text-neutral-400">
          <p>
            This is an <strong className="font-medium text-neutral-200">adults-only</strong> website.
            It may contain nudity, sexually explicit material, and other content not suitable for
            minors.
          </p>
          <p>
            By entering, you confirm that you are at least{" "}
            <strong className="font-medium text-neutral-200">18 years of age</strong> (or the age of
            majority in your jurisdiction), that viewing such material is legal where you are
            located, and that you agree to our{" "}
            <Link href="/legal/terms" className="text-neutral-300 underline hover:text-neutral-100">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/legal/privacy"
              className="text-neutral-300 underline hover:text-neutral-100"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>

        <div className="mt-10">
          <button
            type="button"
            onClick={handleEnter}
            className="w-full rounded-lg bg-neutral-100 py-4 text-xs font-medium uppercase tracking-widest text-neutral-950 transition-opacity hover:opacity-90"
          >
            I am 18+ — Enter site
          </button>
        </div>

        <a
          href="https://www.google.com"
          className="mt-4 inline-block text-xs uppercase tracking-widest text-neutral-600 transition-colors hover:text-neutral-400"
        >
          I am under 18 — Exit
        </a>

        <nav
          aria-label="Legal"
          className="mt-10 flex flex-wrap justify-center gap-x-4 gap-y-2 text-[10px] uppercase tracking-wider text-neutral-600"
        >
          {legalLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-neutral-400">
              {link.label}
            </Link>
          ))}
        </nav>

        <p className="mt-6 text-[11px] leading-relaxed text-neutral-700">
          If you do not meet these requirements, you must leave immediately. {site.name} is not
          intended for minors.
        </p>
      </div>
    </main>
  );
}
