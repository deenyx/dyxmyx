import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ModelPageHeader } from "@/components/model-nav";
import { VideoGallery } from "@/components/video-gallery";
import { getAllProfiles, getProfileByUsername } from "@/lib/profiles";
import { profileMetaDescription } from "@/lib/model-routes";
import { resolveVideo } from "@/lib/video";

type Props = { params: Promise<{ username: string }> };

export function generateStaticParams() {
  return getAllProfiles().map((p) => ({ username: p.username }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const profile = getProfileByUsername(username);
  if (!profile) return {};
  return {
    title: `${profile.name} — Videos`,
    description: profileMetaDescription(profile),
  };
}

export default async function ModelVideosPage({ params }: Props) {
  const { username } = await params;
  const profile = getProfileByUsername(username);
  if (!profile) notFound();

  const totalVideos = profile.videos.length;

  const items = profile.videos
    .map((video) => {
      const resolved = resolveVideo(video);
      if (!resolved) return null;
      return { video, resolved };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  const excludedCount = Math.max(0, totalVideos - items.length);

  return (
    <main className="mx-auto max-w-6xl flex-1 px-6 py-10">
      <div className="mb-8">
        <ModelPageHeader
          title="Videos"
          description={`Showreels and clips for ${profile.name}. Select a video from the list — pre-roll ads play before each clip when enabled.`}
        />
        {excludedCount > 0 && (
          <p className="mt-3 text-xs uppercase tracking-wider text-neutral-500">
            {excludedCount} source{excludedCount === 1 ? " was" : "s were"} hidden by Bunny-only video
            policy.
          </p>
        )}
      </div>

      {items.length > 0 ? (
        <VideoGallery items={items} modelName={profile.name} />
      ) : (
        <div className="rounded-xl border border-dashed border-neutral-800 px-6 py-12 text-center">
          <p className="text-neutral-600">No videos yet.</p>
        </div>
      )}
    </main>
  );
}
