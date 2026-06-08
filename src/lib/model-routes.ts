import type { ModelSection, Profile } from "./types";

export const modelNav: { section: ModelSection; label: string; path: string }[] = [
  { section: "bio", label: "Bio", path: "/bio" },
  { section: "pics", label: "Pics", path: "/pics" },
  { section: "video", label: "Video", path: "/video" },
  { section: "wall", label: "Wall", path: "/wall" },
  { section: "contact", label: "Contact", path: "/contact" },
];

export function modelBasePath(username: string): string {
  return `/${username}`;
}

export function modelSectionPath(username: string, section: ModelSection): string {
  const item = modelNav.find((n) => n.section === section);
  return `${modelBasePath(username)}${item?.path ?? ""}`;
}

export function formatWallDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function profileMetaDescription(profile: Profile): string {
  return profile.bio.slice(0, 160);
}
