import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ModelPageHeader } from "@/components/model-nav";
import { getAllProfiles, getProfileByUsername } from "@/lib/profiles";
import { modelSectionPath, profileMetaDescription } from "@/lib/model-routes";

type Props = { params: Promise<{ username: string }> };

export async function generateStaticParams() {
  return getAllProfiles().map((p) => ({ username: p.username }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const profile = getProfileByUsername(username);
  if (!profile) return {};
  return {
    title: `${profile.name} — Bio`,
    description: profileMetaDescription(profile),
  };
}

export default async function ModelBioPage({ params }: Props) {
  const { username } = await params;
  const profile = getProfileByUsername(username);
  if (!profile) notFound();

  const sections = [
    { label: "Pyxs", href: modelSectionPath(username, "pyxs"), count: profile.photos.length },
    { label: "Video", href: modelSectionPath(username, "video"), count: profile.videos.length },
    { label: "Wall", href: modelSectionPath(username, "wall"), count: null },
    { label: "Contact", href: modelSectionPath(username, "contact"), count: null },
  ] as const;

  return (
    <main className="mx-auto max-w-4xl flex-1 px-6 py-10">
      <div className="relative mx-auto mb-10 aspect-[3/4] max-h-[70vh] max-w-md overflow-hidden rounded-xl bg-neutral-900">
        <Image
          src="https://dyxmyx.b-cdn.net/pyxs/1.jpg"
          alt={profile.name}
          fill
          priority
          className="object-cover object-top"
          sizes="(max-width: 768px) 100vw, 448px"
        />
      </div>

      <ModelPageHeader title={profile.name} />

      <div className="mb-8 flex flex-wrap gap-x-6 gap-y-1 text-xs uppercase tracking-widest text-neutral-500">
        {profile.location && <span>{profile.location}</span>}
        {profile.height && <span>{profile.height}</span>}
      </div>

      <p className="max-w-2xl text-base leading-relaxed text-neutral-300 whitespace-pre-wrap">
        {profile.bio}
      </p>

      <div className="mt-12 grid gap-3 sm:grid-cols-2">
        {sections.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="group rounded-xl border border-neutral-800 bg-neutral-900/30 px-5 py-4 transition-colors hover:border-neutral-600 hover:bg-neutral-900/60"
          >
            <span className="text-xs uppercase tracking-widest text-neutral-500 group-hover:text-neutral-300">
              {s.label}
            </span>
            {s.count !== null && (
              <span className="mt-1 block font-serif text-2xl text-neutral-100">{s.count}</span>
            )}
          </Link>
        ))}
      </div>
    </main>
  );
}
