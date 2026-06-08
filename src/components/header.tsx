import Link from "next/link";
import { site } from "@/lib/site";
import { modelSectionPath } from "@/lib/model-routes";
import { usernameExists } from "@/lib/profiles";

export function Header() {
  const founderHref = usernameExists(site.founder.username)
    ? modelSectionPath(site.founder.username, "bio")
    : "/welcome";

  return (
    <header className="border-b border-neutral-800/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link href={founderHref} className="group">
          <span className="font-serif text-lg tracking-widest text-neutral-100 transition-opacity group-hover:opacity-70">
            {site.name}
          </span>
        </Link>
        <nav className="flex items-center gap-6 text-xs uppercase tracking-widest">
          <span className="hidden text-red-400/80 sm:inline">18+</span>
          <Link
            href={founderHref}
            className="text-neutral-500 transition-colors hover:text-neutral-200"
          >
            {site.founder.name}
          </Link>
        </nav>
      </div>
    </header>
  );
}
