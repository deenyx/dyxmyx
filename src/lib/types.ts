export type ProfileVideo = {
  url: string;
  /** Bunny Stream video GUID for iframe playback (requires library ID env var). */
  streamId?: string;
  title?: string;
  /** CDN thumbnail / poster image URL */
  poster?: string;
  /** Set when the CDN URL has no file extension (e.g. signed mp4 or HLS manifest). */
  format?: "hls" | "mp4" | "webm";
};

export type VideoKind = "youtube" | "vimeo" | "bunny" | "hls" | "direct" | "unknown";

export type ResolvedVideo = {
  kind: VideoKind;
  src: string;
  poster?: string;
  title?: string;
};

export type Profile = {
  username: string;
  name: string;
  bio: string;
  location?: string;
  height?: string;
  contactEmail?: string;
  avatar: string;
  photos: { url: string; title?: string }[];
  videos: ProfileVideo[];
  createdAt: string;
};

export type WallPost = {
  id: string;
  authorName: string;
  message: string;
  createdAt: string;
};

export type ModelSection = "bio" | "pyxs" | "video" | "wall" | "contact";
