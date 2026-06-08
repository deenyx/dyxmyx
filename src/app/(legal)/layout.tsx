import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { site } from "@/lib/site";

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="border-b border-neutral-800/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link href="/" className="font-serif text-lg tracking-widest text-neutral-100">
            {site.name}
          </Link>
          <span className="text-xs uppercase tracking-widest text-red-400/80">18+</span>
        </div>
      </header>
      {children}
      <SiteFooter />
    </>
  );
}
