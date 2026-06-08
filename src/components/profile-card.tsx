import Image from "next/image";
import Link from "next/link";
import type { Profile } from "@/lib/types";

export function ProfileCard({ profile }: { profile: Profile }) {
  return (
    <Link href={`/${profile.username}`} className="group relative block overflow-hidden">
      <div className="relative aspect-[3/4] overflow-hidden bg-neutral-900">
        <Image
          src={profile.avatar}
          alt={profile.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-80 transition-opacity group-hover:opacity-100" />
        <div className="absolute inset-x-0 bottom-0 p-5">
          <h2 className="font-serif text-xl tracking-wide text-white">{profile.name}</h2>
          {profile.location && (
            <p className="mt-1 text-xs uppercase tracking-widest text-neutral-400">
              {profile.location}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
