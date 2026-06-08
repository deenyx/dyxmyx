import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ModelPageHeader } from "@/components/model-nav";
import { getAllProfiles, getProfileByUsername } from "@/lib/profiles";
import { profileMetaDescription } from "@/lib/model-routes";

type Props = { params: Promise<{ username: string }> };

export function generateStaticParams() {
  return getAllProfiles().map((p) => ({ username: p.username }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const profile = getProfileByUsername(username);
  if (!profile) return {};
  return {
    title: `${profile.name} — Pics`,
    description: profileMetaDescription(profile),
  };
}

export default async function ModelPicsPage({ params }: Props) {
  const { username } = await params;
  const profile = getProfileByUsername(username);
  if (!profile) notFound();

  return (
    <main className="mx-auto max-w-4xl flex-1 px-6 py-10">
      <ModelPageHeader
        title="Pics"
        description={`Photo gallery for ${profile.name}.`}
      />

      {profile.photos.length > 0 ? (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
          {profile.photos.map((photo, i) => (
            <div key={photo} className="relative aspect-[3/4] overflow-hidden rounded-lg bg-neutral-900">
              <Image
                src={photo}
                alt={`${profile.name} — ${i + 1}`}
                fill
                className="object-cover transition-transform duration-500 hover:scale-105"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-neutral-600">No photos yet.</p>
      )}
    </main>
  );
}
