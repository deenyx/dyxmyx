import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getAllProfiles, getProfileByUsername } from "@/lib/profiles";
import { modelSectionPath, profileMetaDescription } from "@/lib/model-routes";
import { PyxsGallery } from "@/components/pyxs-gallery";
import { ExoClickAd } from "@/components/exoclick-ad";

type Props = { params: Promise<{ username: string }> };

export function generateStaticParams() {
  return getAllProfiles().map((p) => ({ username: p.username }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const profile = getProfileByUsername(username);
  if (!profile) return {};
  return {
    title: `${profile.name} — Pyxs`,
    description: profileMetaDescription(profile),
  };
}

export default async function ModelPyxsPage({ params }: Props) {
  const { username } = await params;
  const profile = getProfileByUsername(username);
  if (!profile) notFound();

  return (
    <main className="bg-zinc-950 text-zinc-200 min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <ExoClickAd zoneId="5947826" className="mb-8 mx-auto max-w-[728px]" />

        <header className="flex justify-between items-center mb-12 border-b border-pink-500/30 pb-6">
          <Link href="/" className="text-4xl font-bold" style={{ textShadow: "0 0 15px #ff00ff, 0 0 25px #00ffff" }}>
            DYXMYX
          </Link>
          <nav className="flex gap-8 text-lg">
            <Link href={modelSectionPath(username, "bio")} className="hover:text-pink-400 transition">
              Bio
            </Link>
            <Link href={modelSectionPath(username, "pyxs")} className="text-pink-400 font-medium">
              Pyxs
            </Link>
            <Link href={modelSectionPath(username, "video")} className="hover:text-pink-400 transition">
              Videos
            </Link>
          </nav>
        </header>

        <h1 className="text-6xl font-bold text-center mb-4" style={{ textShadow: "0 0 15px #ff00ff, 0 0 25px #00ffff" }}>
          {profile.name} Pyxs
        </h1>
        <p className="text-pink-300 text-center text-xl mb-16">My private & naughty photo collection</p>

        <PyxsGallery photos={profile.photos} profileName={profile.name} />

        <ExoClickAd zoneId="5947824" className="mt-12 mx-auto max-w-[728px]" />
        <ExoClickAd zoneId="5947832" className="mt-8 mx-auto max-w-[728px]" />
      </div>

      <footer className="mt-20 py-10 text-center text-zinc-500 text-sm border-t border-pink-500/20">
        © 2026 DyxMyx • 18+ Only
      </footer>
    </main>
  );
}
