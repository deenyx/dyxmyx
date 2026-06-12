export type AdBannerSlot =
  | "videos-header"
  | "videos-list-top"
  | "videos-list-bottom"
  | "videos-sidebar"
  | "videos-player-top"
  | "videos-player-bottom"
  | "videos-footer"
  | "videos-inline"
  | "videos-mobile-inline"
  | "bio-header"
  | "bio-footer"
  | "pyxs-header"
  | "pyxs-footer"
  | "wall-header"
  | "wall-footer"
  | "contact-header"
  | "contact-footer"
  | "sticky";

const zoneIds: Record<AdBannerSlot, string> = {
  "videos-header": process.env.NEXT_PUBLIC_AD_ZONE_VIDEOS_HEADER ?? "",
  "videos-list-top": process.env.NEXT_PUBLIC_AD_ZONE_VIDEOS_LIST_TOP ?? "",
  "videos-list-bottom": process.env.NEXT_PUBLIC_AD_ZONE_VIDEOS_LIST_BOTTOM ?? "",
  "videos-sidebar": process.env.NEXT_PUBLIC_AD_ZONE_VIDEOS_SIDEBAR ?? "",
  "videos-player-top": process.env.NEXT_PUBLIC_AD_ZONE_VIDEOS_PLAYER_TOP ?? "",
  "videos-player-bottom": process.env.NEXT_PUBLIC_AD_ZONE_VIDEOS_PLAYER_BOTTOM ?? "",
  "videos-footer": process.env.NEXT_PUBLIC_AD_ZONE_VIDEOS_FOOTER ?? "",
  "videos-inline": process.env.NEXT_PUBLIC_AD_ZONE_VIDEOS_INLINE ?? "",
  "videos-mobile-inline": process.env.NEXT_PUBLIC_AD_ZONE_VIDEOS_MOBILE_INLINE ?? "",
  "bio-header": process.env.NEXT_PUBLIC_AD_ZONE_BIO_HEADER ?? "",
  "bio-footer": process.env.NEXT_PUBLIC_AD_ZONE_BIO_FOOTER ?? "",
  "pyxs-header": process.env.NEXT_PUBLIC_AD_ZONE_PYXS_HEADER ?? "",
  "pyxs-footer": process.env.NEXT_PUBLIC_AD_ZONE_PYXS_FOOTER ?? "",
  "wall-header": process.env.NEXT_PUBLIC_AD_ZONE_WALL_HEADER ?? "",
  "wall-footer": process.env.NEXT_PUBLIC_AD_ZONE_WALL_FOOTER ?? "",
  "contact-header": process.env.NEXT_PUBLIC_AD_ZONE_CONTACT_HEADER ?? "",
  "contact-footer": process.env.NEXT_PUBLIC_AD_ZONE_CONTACT_FOOTER ?? "",
  "sticky": process.env.NEXT_PUBLIC_AD_ZONE_STICKY ?? "",
};

const snippets: Record<AdBannerSlot, string> = {
  "videos-header": process.env.NEXT_PUBLIC_AD_SNIPPET_VIDEOS_HEADER ?? "",
  "videos-list-top": process.env.NEXT_PUBLIC_AD_SNIPPET_VIDEOS_LIST_TOP ?? "",
  "videos-list-bottom": process.env.NEXT_PUBLIC_AD_SNIPPET_VIDEOS_LIST_BOTTOM ?? "",
  "videos-sidebar": process.env.NEXT_PUBLIC_AD_SNIPPET_VIDEOS_SIDEBAR ?? "",
  "videos-player-top": process.env.NEXT_PUBLIC_AD_SNIPPET_VIDEOS_PLAYER_TOP ?? "",
  "videos-player-bottom": process.env.NEXT_PUBLIC_AD_SNIPPET_VIDEOS_PLAYER_BOTTOM ?? "",
  "videos-footer": process.env.NEXT_PUBLIC_AD_SNIPPET_VIDEOS_FOOTER ?? "",
  "videos-inline": process.env.NEXT_PUBLIC_AD_SNIPPET_VIDEOS_INLINE ?? "",
  "videos-mobile-inline": process.env.NEXT_PUBLIC_AD_SNIPPET_VIDEOS_MOBILE_INLINE ?? "",
  "bio-header": process.env.NEXT_PUBLIC_AD_SNIPPET_BIO_HEADER ?? "",
  "bio-footer": process.env.NEXT_PUBLIC_AD_SNIPPET_BIO_FOOTER ?? "",
  "pyxs-header": process.env.NEXT_PUBLIC_AD_SNIPPET_PYXS_HEADER ?? "",
  "pyxs-footer": process.env.NEXT_PUBLIC_AD_SNIPPET_PYXS_FOOTER ?? "",
  "wall-header": process.env.NEXT_PUBLIC_AD_SNIPPET_WALL_HEADER ?? "",
  "wall-footer": process.env.NEXT_PUBLIC_AD_SNIPPET_WALL_FOOTER ?? "",
  "contact-header": process.env.NEXT_PUBLIC_AD_SNIPPET_CONTACT_HEADER ?? "",
  "contact-footer": process.env.NEXT_PUBLIC_AD_SNIPPET_CONTACT_FOOTER ?? "",
  "sticky": process.env.NEXT_PUBLIC_AD_SNIPPET_STICKY ?? "",
};

export const adsConfig = {
  enabled: process.env.NEXT_PUBLIC_ADS_ENABLED === "true",
  vastPreRollUrl: process.env.NEXT_PUBLIC_VAST_PREROLL_URL ?? "",
  /** exoclick | juicyads | custom */
  network: process.env.NEXT_PUBLIC_AD_NETWORK ?? "exoclick",
  providerScript:
    process.env.NEXT_PUBLIC_AD_PROVIDER_SCRIPT ?? "https://a.exoclick.com/ad-provider.js",
} as const;

export function getBannerZoneId(slot: AdBannerSlot): string {
  return zoneIds[slot]?.trim() ?? "";
}

export function getBannerSnippet(slot: AdBannerSlot): string {
  return snippets[slot]?.trim() ?? "";
}

export function bannerDivId(slot: AdBannerSlot, instanceKey?: string): string {
  if (!instanceKey) return `dyx-ad-${slot}`;
  return `dyx-ad-${slot}-${instanceKey}`;
}
