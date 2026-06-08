import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";
import type { WallPost } from "./types";

const wallsDir = path.join(process.cwd(), "data/walls");

function wallPath(username: string): string {
  return path.join(wallsDir, `${username}.json`);
}

function readWall(username: string): WallPost[] {
  const file = wallPath(username);
  if (!fs.existsSync(file)) return [];
  return JSON.parse(fs.readFileSync(file, "utf8")) as WallPost[];
}

function writeWall(username: string, posts: WallPost[]): void {
  fs.mkdirSync(wallsDir, { recursive: true });
  fs.writeFileSync(wallPath(username), JSON.stringify(posts, null, 2));
}

export function getWallPosts(username: string): WallPost[] {
  return readWall(username).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export function addWallPost(
  username: string,
  authorName: string,
  message: string,
): WallPost {
  const posts = readWall(username);
  const post: WallPost = {
    id: randomUUID(),
    authorName: authorName.trim(),
    message: message.trim(),
    createdAt: new Date().toISOString(),
  };
  posts.unshift(post);
  writeWall(username, posts);
  return post;
}
