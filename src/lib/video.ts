import type { ProfileVideo, ResolvedVideo, VideoKind } from "./types";

const videoSourcePolicy =
  (process.env.NEXT_PUBLIC_VIDEO_SOURCE_POLICY ?? "bunny-only").trim().toLowerCase();
const bunnyStreamLibraryId =
  (process.env.NEXT_PUBLIC_BUNNY_STREAM_LIBRARY_ID ?? "").trim();

function isBunnyHost(host: string): boolean {
  return host.endsWith(".b-cdn.net") || host.endsWith(".bunnycdn.com");
}

function extensionKind(url: string): VideoKind | null {
  if (/\.m3u8(\?|$)/i.test(url)) return "hls";
  if (/\.(mp4|webm|mov)(\?|$)/i.test(url)) return "direct";
  return null;
}

export function resolveVideo(video: ProfileVideo): ResolvedVideo | null {
  if (video.streamId && bunnyStreamLibraryId) {
    return {
      kind: "bunny",
      src: `https://iframe.mediadelivery.net/embed/${bunnyStreamLibraryId}/${video.streamId}`,
      poster: video.poster,
      title: video.title,
    };
  }

  const url = video.url.trim();
  if (!url) return null;

  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase();

    if (videoSourcePolicy === "bunny-only" && !isBunnyHost(host)) {
      return null;
    }

    if (host.includes("youtube.com") || host.includes("youtu.be")) {
      let id = parsed.searchParams.get("v");
      if (!id && host.includes("youtu.be")) id = parsed.pathname.slice(1);
      if (id) {
        return {
          kind: "youtube",
          src: `https://www.youtube.com/embed/${id}`,
          poster: video.poster,
          title: video.title,
        };
      }
    }

    if (host.includes("vimeo.com")) {
      const id = parsed.pathname.split("/").filter(Boolean).pop();
      if (id) {
        return {
          kind: "vimeo",
          src: `https://player.vimeo.com/video/${id}`,
          poster: video.poster,
          title: video.title,
        };
      }
    }

    if (host.includes("player.mediadelivery.net")) {
      const parts = parsed.pathname.split("/").filter(Boolean);
      if (parts[0] === "play" && parts.length >= 3) {
        return {
          kind: "bunny",
          src: `https://iframe.mediadelivery.net/embed/${parts[1]}/${parts[2]}`,
          poster: video.poster,
          title: video.title,
        };
      }
    }

    if (host.includes("iframe.mediadelivery.net")) {
      const parts = parsed.pathname.split("/").filter(Boolean);
      if (parts[0] === "embed" && parts.length >= 3) {
        return {
          kind: "bunny",
          src: `${parsed.origin}${parsed.pathname}`,
          poster: video.poster,
          title: video.title,
        };
      }
    }

    if (video.format === "hls") {
      return { kind: "hls", src: url, poster: video.poster, title: video.title };
    }

    if (video.format === "mp4" || video.format === "webm") {
      return { kind: "direct", src: url, poster: video.poster, title: video.title };
    }

    const fromExt = extensionKind(url);
    if (fromExt) {
      return { kind: fromExt, src: url, poster: video.poster, title: video.title };
    }

    // CDN URLs without extensions — common for signed or path-based delivery
    if (host.includes("b-cdn") || host.includes("bunny") || parsed.pathname.includes("/video")) {
      return { kind: "direct", src: url, poster: video.poster, title: video.title };
    }
  } catch {
    return null;
  }

  return null;
}

export function isEmbedKind(kind: VideoKind): boolean {
  return kind === "youtube" || kind === "vimeo" || kind === "bunny";
}

export function isNativeKind(kind: VideoKind): boolean {
  return kind === "direct" || kind === "hls";
}

export function parseVideosJson(raw: string): ProfileVideo[] {
  if (!raw.trim()) return [];
  try {
    const parsed = JSON.parse(raw) as ProfileVideo[];
    return parsed.filter((v) => v.url?.trim());
  } catch {
    return [];
  }
}
