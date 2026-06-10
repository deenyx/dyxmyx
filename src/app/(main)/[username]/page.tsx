import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
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

  return (
    <main className="bg-zinc-950 text-zinc-200 min-h-screen">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <header className="flex justify-between items-center mb-12">
          <Link href="/" className="text-3xl font-bold" style={{ textShadow: "0 0 15px #ff00ff, 0 0 25px #00ffff" }}>
            DYXMYX
          </Link>
          <nav className="space-x-6 hidden md:flex">
            <Link href={modelSectionPath(username, "bio")} className="hover:text-pink-400 transition">Bio</Link>
            <Link href={modelSectionPath(username, "pyxs")} className="hover:text-pink-400 transition">Pyxs</Link>
            <Link href={modelSectionPath(username, "video")} className="hover:text-pink-400 transition">Videos</Link>
          </nav>
        </header>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="rounded-2xl overflow-hidden shadow-2xl" style={{ boxShadow: "0 0 30px rgba(236, 72, 153, 0.3)" }}>
            <div className="relative w-full aspect-[3/4] bg-zinc-900">
              <Image
                src="/1.jpg"
                alt={profile.name}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>

          <div>
            <h1 className="text-6xl font-bold mb-6" style={{ textShadow: "0 0 15px #ff00ff, 0 0 25px #00ffff" }}>
              {profile.name}
            </h1>
            <p className="text-lg leading-relaxed text-zinc-300 mb-8">
              {profile.bio}
            </p>
            <div className="mt-10 flex gap-4 flex-col sm:flex-row">
              <Link
                href={modelSectionPath(username, "pyxs")}
                className="px-8 py-4 bg-pink-600 hover:bg-pink-500 rounded-xl font-medium text-center transition"
              >
                View Gallery
              </Link>
              <Link
                href={modelSectionPath(username, "contact")}
                className="px-8 py-4 border border-cyan-400 hover:bg-cyan-400 hover:text-black rounded-xl font-medium text-center transition"
              >
                Message Me
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
