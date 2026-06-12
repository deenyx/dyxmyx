import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ModelPageHeader } from "@/components/model-nav";
import { WallMessageForm } from "@/components/wall-message-form";
import { getAllProfiles, getProfileByUsername } from "@/lib/profiles";
import { formatWallDate } from "@/lib/model-routes";
import { getWallPosts } from "@/lib/wall";
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
    title: `${profile.name} — Wall`,
    description: `Guest wall for ${profile.name}.`,
  };
}

export default async function ModelWallPage({ params }: Props) {
  const { username } = await params;
  const profile = getProfileByUsername(username);
  if (!profile) notFound();

  const posts = getWallPosts(username);

  return (
    <main className="mx-auto max-w-2xl flex-1 px-6 py-10">
      <ExoClickAd zoneId="5947828" className="mb-8 mx-auto max-w-[728px]" />

      <ModelPageHeader
        title="Wall"
        description={`Leave a note for ${profile.name}. Posts appear publicly.`}
      />

      <WallMessageForm />

      <div className="mt-12 space-y-4">
        {posts.length > 0 ? (
          posts.map((post) => (
            <article
              key={post.id}
              className="rounded-xl border border-neutral-800 bg-neutral-900/30 px-5 py-4"
            >
              <div className="flex items-baseline justify-between gap-4">
                <p className="font-medium text-neutral-200">{post.authorName}</p>
                <time className="shrink-0 text-xs text-neutral-600">
                  {formatWallDate(post.createdAt)}
                </time>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-neutral-400 whitespace-pre-wrap">
                {post.message}
              </p>
            </article>
          ))
        ) : (
          <p className="text-center text-sm text-neutral-600">No posts yet — be the first.</p>
        )}
      </div>

      <ExoClickAd zoneId="5947832" className="mt-12 mx-auto max-w-[728px]" />
    </main>
  );
}
