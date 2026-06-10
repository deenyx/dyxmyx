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
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
        <div
          className="flex-shrink-0 rounded-xl overflow-hidden"
          style={{
            boxShadow:
              "0 0 20px rgba(255, 20, 147, 0.5), 0 0 30px rgba(128, 0, 128, 0.3), 0 0 40px rgba(0, 255, 255, 0.3)",
            border: "2px solid transparent",
            background: "linear-gradient(135deg, #FF1493, #8B00FF, #00FFFF) border-box",
          }}
        >
          <div className="relative w-64 h-80 bg-neutral-900">
            <Image
              src="/1.jpg"
              alt={profile.name}
              fill
              priority
              className="object-cover"
              sizes="256px"
            />
          </div>
        </div>

        <div className="flex-1">
          <ModelPageHeader title={profile.name} />

          <div className="mb-6 flex flex-wrap gap-x-6 gap-y-2 text-sm uppercase tracking-widest text-neutral-400">
            {profile.height && <span>{profile.height}</span>}
            {profile.location && <span>{profile.location}</span>}
          </div>

          <p className="text-base leading-relaxed text-neutral-300 whitespace-pre-wrap">
            {profile.bio}
          </p>
        </div>
      </div>

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
