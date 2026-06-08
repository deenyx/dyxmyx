import fs from "fs";
import path from "path";
import type { Profile } from "./types";

export { resolveVideo, parseVideosJson, isEmbedKind, isNativeKind } from "./video";
export type { ResolvedVideo, VideoKind } from "./types";

const dataPath = path.join(process.cwd(), "data/profiles.json");

function readProfiles(): Profile[] {
  if (!fs.existsSync(dataPath)) return [];
  const raw = fs.readFileSync(dataPath, "utf8");
  return JSON.parse(raw) as Profile[];
}

function writeProfiles(profiles: Profile[]): void {
  fs.writeFileSync(dataPath, JSON.stringify(profiles, null, 2));
}

export function getAllProfiles(): Profile[] {
  return readProfiles().sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export function getProfileByUsername(username: string): Profile | undefined {
  return readProfiles().find((p) => p.username === username);
}

export function usernameExists(username: string): boolean {
  return readProfiles().some((p) => p.username === username);
}

export function saveProfile(profile: Profile): void {
  const profiles = readProfiles();
  const index = profiles.findIndex((p) => p.username === profile.username);
  if (index >= 0) {
    profiles[index] = profile;
  } else {
    profiles.push(profile);
  }
  writeProfiles(profiles);
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

