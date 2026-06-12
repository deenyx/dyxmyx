import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllProfiles, getProfileByUsername } from "@/lib/profiles";
import { modelSectionPath, profileMetaDescription } from "@/lib/model-routes";
import { ExoClickAd } from "@/components/exoclick-ad";

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
    <main className="bg-zinc-950 text-zinc-200 min-h-screen flex flex-col">
      <div className="flex-1 max-w-6xl mx-auto w-full px-6 py-8 md:py-16">
        <ExoClickAd zoneId="5947824" className="mb-8 mx-auto max-w-[728px]" />

        <div className="grid md:grid-cols-3 gap-12 items-start">
          {/* Image Section - Left Column */}
          <div className="md:col-span-1 flex flex-col items-center">
            <div
              className="w-full rounded-xl overflow-hidden shadow-2xl mb-8"
              style={{
                boxShadow: "0 0 40px rgba(255, 20, 147, 0.6), 0 0 60px rgba(0, 255, 255, 0.3)",
                border: "2px solid rgba(255, 20, 147, 0.3)"
              }}
            >
              <div className="relative w-full aspect-[3/4] bg-zinc-900">
                <img
                  src={profile.photos && profile.photos[0]?.url || "/deenyx/pyxs/1.jpeg"}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                  loading="eager"
                />
              </div>
            </div>
          </div>

          {/* Bio Section - Right Columns */}
          <div className="md:col-span-2">
            <div className="mb-8">
              <h1
                className="text-7xl md:text-8xl font-bold mb-4"
                style={{ textShadow: "0 0 20px #ff00ff, 0 0 40px #00ffff" }}
              >
                {profile.name}
              </h1>

              {/* Stats Row */}
              <div className="flex flex-wrap gap-6 mb-8 text-sm md:text-base">
                {profile.height && (
                  <div className="flex flex-col">
                    <span className="text-pink-400 font-semibold uppercase tracking-wider">Height</span>
                    <span className="text-lg text-zinc-300">{profile.height}</span>
                  </div>
                )}
                {profile.location && (
                  <div className="flex flex-col">
                    <span className="text-pink-400 font-semibold uppercase tracking-wider">Location</span>
                    <span className="text-lg text-zinc-300">{profile.location}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Bio Text */}
            <div className="mb-10">
              <p className="text-lg md:text-xl leading-relaxed text-zinc-200 mb-6 font-light">
                {profile.bio}
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <Link
                href={modelSectionPath(username, "pyxs")}
                className="px-8 py-4 bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-500 hover:to-pink-400 rounded-lg font-semibold text-center transition transform hover:scale-105 uppercase tracking-wider"
              >
                View Gallery
              </Link>
              <Link
                href={modelSectionPath(username, "contact")}
                className="px-8 py-4 border-2 border-cyan-400 hover:bg-cyan-400 hover:text-black rounded-lg font-semibold text-center transition text-cyan-400 uppercase tracking-wider"
              >
                Message Me
              </Link>
              <Link
                href={modelSectionPath(username, "video")}
                className="px-8 py-4 border-2 border-purple-400 hover:bg-purple-400/10 rounded-lg font-semibold text-center transition text-purple-400 uppercase tracking-wider"
              >
                Videos
              </Link>
              <a
                href="https://paypal.me/therealdfn"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 rounded-lg font-semibold text-center transition transform hover:scale-105 uppercase tracking-wider"
              >
                Tip This Bitch
              </a>
              <a
                href="https://paypal.me/therealdfn"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 border-2 border-green-400 hover:bg-green-400/10 rounded-lg font-semibold text-center transition text-green-400 uppercase tracking-wider"
              >
                Donate to Fuxem
              </a>
            </div>

            {/* Section Links */}
            <nav className="flex flex-wrap gap-3">
              <Link
                href={modelSectionPath(username, "pyxs")}
                className="text-xs uppercase tracking-wider text-pink-400 hover:text-pink-300 transition"
              >
                ► Photos
              </Link>
              <Link
                href={modelSectionPath(username, "video")}
                className="text-xs uppercase tracking-wider text-cyan-400 hover:text-cyan-300 transition"
              >
                ► Videos
              </Link>
              <Link
                href={modelSectionPath(username, "wall")}
                className="text-xs uppercase tracking-wider text-purple-400 hover:text-purple-300 transition"
              >
                ► Wall
              </Link>
            </nav>
          </div>
        </div>

        <ExoClickAd zoneId="5947828" className="mt-12 mx-auto max-w-[728px]" />
      </div>
    </main>
  );
}
