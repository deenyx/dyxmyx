import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ModelPageHeader } from "@/components/model-nav";
import { type GalleryItem, VideoGallery } from "@/components/video-gallery";
import { getAllProfiles, getProfileByUsername } from "@/lib/profiles";
import { profileMetaDescription } from "@/lib/model-routes";
import { resolveVideo } from "@/lib/video";
import { site } from "@/lib/site";
import type { Profile } from "@/lib/types";

function getRouteId(rawId: number | undefined, fallbackId: number): string {
  if (typeof rawId === "number" && Number.isInteger(rawId) && rawId > 0) {
    return String(rawId);
  }

  return String(fallbackId);
}

type Props = { params: Promise<{ username: string }> };

export function getResolvedVideoItems(profile: Profile): GalleryItem[] {
  return profile.videos
    .map((video, index) => {
      const resolved = resolveVideo(video);
      if (!resolved) return null;
      return {
        video,
        resolved,
        routeId: getRouteId(video.id, index + 1),
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);
}

export function getVideoItemById(videoId: string | undefined, items: GalleryItem[]) {
  if (!videoId) return null;

  return items.find((item) => item.routeId === videoId) ?? null;
}

export function generateStaticParams() {
  return getAllProfiles().map((p) => ({ username: p.username }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const profile = getProfileByUsername(username);
  if (!profile) return {};

  const title = `${profile.name} — Videos`;
  const description = profileMetaDescription(profile);

  const url = `https://${site.domain}/${username}/videos`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      type: "website",
      url,
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

type ContentProps = {
  profile: Profile;
  username: string;
  selectedVideoId?: string;
};

export function ModelVideosPageContent({ profile, username, selectedVideoId }: ContentProps) {
  const totalVideos = profile.videos.length;
  const items = getResolvedVideoItems(profile);
  const selectedItem = getVideoItemById(selectedVideoId, items);

  if (selectedVideoId && !selectedItem) {
    notFound();
  }

  const excludedCount = Math.max(0, totalVideos - items.length);
  const pageTitle = selectedItem
    ? selectedItem.video.title?.trim() || `Video ${selectedItem.routeId}`
    : "Videos";
  const pageDescription = selectedItem
    ? `Watch ${selectedItem.video.title?.trim() || `Video ${selectedItem.routeId}`} from ${profile.name}. Browse more clips below.`
    : `Showreels and clips for ${profile.name}. Pick a thumbnail to open a dedicated video page.`;

  return (
    <main className="mx-auto max-w-6xl flex-1 px-6 py-10">
      <div className="mb-8">
        <ModelPageHeader
          title={pageTitle}
          description={pageDescription}
          titleClassName="copperplate-gradient-title"
        />
        {excludedCount > 0 && (
          <p className="mt-3 text-xs uppercase tracking-wider text-neutral-500">
            {excludedCount} source{excludedCount === 1 ? " was" : "s were"} hidden by Bunny-only video
            policy.
          </p>
        )}
      </div>

      {items.length > 0 ? (
        <Suspense fallback={<div className="rounded-xl border border-neutral-800 px-6 py-12 text-center text-neutral-500">Loading videos…</div>}>
          <VideoGallery
            items={items}
            modelName={profile.name}
            basePath={`/${username}/videos`}
            activeVideoId={selectedVideoId}
          />
        </Suspense>
      ) : (
        <div className="rounded-xl border border-dashed border-neutral-800 px-6 py-12 text-center">
          <p className="text-neutral-600">No videos yet.</p>
        </div>
      )}
    </main>
  );
}

export default async function ModelVideosPage({ params }: Props) {
  const { username } = await params;
  const profile = getProfileByUsername(username);
  if (!profile) notFound();

  return <ModelVideosPageContent profile={profile} username={username} />;
}
