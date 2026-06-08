import Link from "next/link";
import type { ReactNode } from "react";

type LegalPageProps = {
  title: string;
  updated: string;
  children: ReactNode;
};

export function LegalPage({ title, updated, children }: LegalPageProps) {
  return (
    <main className="mx-auto max-w-3xl flex-1 px-6 py-12">
      <Link
        href="/"
        className="text-xs uppercase tracking-widest text-neutral-600 transition-colors hover:text-neutral-300"
      >
        ← Back
      </Link>

      <header className="mt-8 border-b border-neutral-800 pb-8">
        <p className="text-xs uppercase tracking-[0.2em] text-red-400/80">Legal</p>
        <h1 className="mt-3 font-serif text-3xl tracking-wide text-neutral-50">{title}</h1>
        <p className="mt-3 text-sm text-neutral-500">Last updated: {updated}</p>
      </header>

      <article className="legal-prose py-10">{children}</article>
    </main>
  );
}

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="mb-10">
      <h2 className="mb-4 text-lg font-medium text-neutral-100">{title}</h2>
      <div className="space-y-4 text-sm leading-relaxed text-neutral-400">{children}</div>
    </section>
  );
}

export function LegalP({ children }: { children: ReactNode }) {
  return <p>{children}</p>;
}

export function LegalUl({ children }: { children: ReactNode }) {
  return <ul className="list-disc space-y-2 pl-5">{children}</ul>;
}
