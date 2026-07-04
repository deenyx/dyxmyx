import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  ModelVideosPageContent,
  getVideoItemById,
  getResolvedVideoItems,
} from "../page";
import { getAllProfiles, getProfileByUsername } from "@/lib/profiles";
import { site } from "@/lib/site";

type Props = { params: Promise<{ username: string; videoId: string }> };

export function generateStaticParams() {
  return getAllProfiles().flatMap((profile) => {
    const items = getResolvedVideoItems(profile);
    return items.map((item) => ({
      username: profile.username,
      videoId: item.routeId,
    }));
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username, videoId } = await params;
  const profile = getProfileByUsername(username);
  if (!profile) return {};

  const items = getResolvedVideoItems(profile);
  const selectedItem = getVideoItemById(videoId, items);
  if (!selectedItem) return {};

  const fallbackTitle = `Video ${selectedItem.routeId}`;
  const title = `${profile.name} — ${selectedItem.video.title?.trim() || fallbackTitle}`;
  const description = `Watch ${selectedItem.video.title?.trim() || fallbackTitle} from ${profile.name}.`;
  const url = `https://${site.domain}/${username}/videos/${selectedItem.routeId}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      type: "video.other",
      url,
      images: selectedItem.video.poster ? [{ url: selectedItem.video.poster }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: selectedItem.video.poster ? [selectedItem.video.poster] : undefined,
    },
  };
}

export default async function ModelVideoDetailPage({ params }: Props) {
  const { username, videoId } = await params;
  const profile = getProfileByUsername(username);
  if (!profile) notFound();

  const items = getResolvedVideoItems(profile);
  if (!getVideoItemById(videoId, items)) {
    notFound();
  }

  return (
    <ModelVideosPageContent
      profile={profile}
      username={username}
      selectedVideoId={videoId}
    />
  );
}