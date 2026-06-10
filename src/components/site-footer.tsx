import Link from "next/link";
import { legalLinks, site } from "@/lib/site";

export function SiteFooter({ showLegalLinks = true, compact = false }: { showLegalLinks?: boolean; compact?: boolean }) {
  if (compact) {
    return (
      <footer className="border-t border-neutral-800/80">
        <div className="mx-auto max-w-6xl px-6 py-2">
          <p className="text-[10px] uppercase tracking-widest text-neutral-600">Adults only · 18+</p>
        </div>
      </footer>
    );
  }

  return (
    <footer className="mt-auto border-t border-neutral-800/80">
      <div className="mx-auto max-w-6xl px-6 py-10">
        {showLegalLinks && !compact && (
          <nav
            aria-label="Legal and compliance"
            className="mb-8 grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-4"
          >
            {legalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[11px] uppercase tracking-wider text-neutral-500 transition-colors hover:text-neutral-300"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}

        <div className={`flex flex-col gap-3 ${!compact ? "border-t border-neutral-800/80 pt-6" : ""} text-xs uppercase tracking-widest text-neutral-600 sm:flex-row sm:items-center sm:justify-between`}>
          <p>© {new Date().getFullYear()} {site.name}</p>
          <p className="text-red-400/70">Adults only · 18+</p>
        </div>

        {!compact && (
          <p className="mt-4 text-[11px] leading-relaxed text-neutral-700">
            All models and performers appearing on this website were 18 years of age or older at the
            time of content creation. Records required pursuant to 18 U.S.C. § 2257 are on file with
            the custodian of records listed in our{" "}
            <Link href="/legal/2257" className="text-neutral-500 underline hover:text-neutral-400">
              2257 Compliance
            </Link>{" "}
            statement.
          </p>
        )}
      </div>
    </footer>
  );
}
