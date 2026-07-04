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

const zoneEnvKeys: Record<AdBannerSlot, string> = {
  "videos-header": "NEXT_PUBLIC_AD_ZONE_VIDEOS_HEADER",
  "videos-list-top": "NEXT_PUBLIC_AD_ZONE_VIDEOS_LIST_TOP",
  "videos-list-bottom": "NEXT_PUBLIC_AD_ZONE_VIDEOS_LIST_BOTTOM",
  "videos-sidebar": "NEXT_PUBLIC_AD_ZONE_VIDEOS_SIDEBAR",
  "videos-player-top": "NEXT_PUBLIC_AD_ZONE_VIDEOS_PLAYER_TOP",
  "videos-player-bottom": "NEXT_PUBLIC_AD_ZONE_VIDEOS_PLAYER_BOTTOM",
  "videos-footer": "NEXT_PUBLIC_AD_ZONE_VIDEOS_FOOTER",
  "videos-inline": "NEXT_PUBLIC_AD_ZONE_VIDEOS_INLINE",
  "videos-mobile-inline": "NEXT_PUBLIC_AD_ZONE_VIDEOS_MOBILE_INLINE",
  "bio-header": "NEXT_PUBLIC_AD_ZONE_BIO_HEADER",
  "bio-footer": "NEXT_PUBLIC_AD_ZONE_BIO_FOOTER",
  "pyxs-header": "NEXT_PUBLIC_AD_ZONE_PYXS_HEADER",
  "pyxs-footer": "NEXT_PUBLIC_AD_ZONE_PYXS_FOOTER",
  "wall-header": "NEXT_PUBLIC_AD_ZONE_WALL_HEADER",
  "wall-footer": "NEXT_PUBLIC_AD_ZONE_WALL_FOOTER",
  "contact-header": "NEXT_PUBLIC_AD_ZONE_CONTACT_HEADER",
  "contact-footer": "NEXT_PUBLIC_AD_ZONE_CONTACT_FOOTER",
  "sticky": "NEXT_PUBLIC_AD_ZONE_STICKY",
};

const snippetEnvKeys: Record<AdBannerSlot, string> = {
  "videos-header": "NEXT_PUBLIC_AD_SNIPPET_VIDEOS_HEADER",
  "videos-list-top": "NEXT_PUBLIC_AD_SNIPPET_VIDEOS_LIST_TOP",
  "videos-list-bottom": "NEXT_PUBLIC_AD_SNIPPET_VIDEOS_LIST_BOTTOM",
  "videos-sidebar": "NEXT_PUBLIC_AD_SNIPPET_VIDEOS_SIDEBAR",
  "videos-player-top": "NEXT_PUBLIC_AD_SNIPPET_VIDEOS_PLAYER_TOP",
  "videos-player-bottom": "NEXT_PUBLIC_AD_SNIPPET_VIDEOS_PLAYER_BOTTOM",
  "videos-footer": "NEXT_PUBLIC_AD_SNIPPET_VIDEOS_FOOTER",
  "videos-inline": "NEXT_PUBLIC_AD_SNIPPET_VIDEOS_INLINE",
  "videos-mobile-inline": "NEXT_PUBLIC_AD_SNIPPET_VIDEOS_MOBILE_INLINE",
  "bio-header": "NEXT_PUBLIC_AD_SNIPPET_BIO_HEADER",
  "bio-footer": "NEXT_PUBLIC_AD_SNIPPET_BIO_FOOTER",
  "pyxs-header": "NEXT_PUBLIC_AD_SNIPPET_PYXS_HEADER",
  "pyxs-footer": "NEXT_PUBLIC_AD_SNIPPET_PYXS_FOOTER",
  "wall-header": "NEXT_PUBLIC_AD_SNIPPET_WALL_HEADER",
  "wall-footer": "NEXT_PUBLIC_AD_SNIPPET_WALL_FOOTER",
  "contact-header": "NEXT_PUBLIC_AD_SNIPPET_CONTACT_HEADER",
  "contact-footer": "NEXT_PUBLIC_AD_SNIPPET_CONTACT_FOOTER",
  "sticky": "NEXT_PUBLIC_AD_SNIPPET_STICKY",
};

const defaultStaticVastPath = "/uploads/vast/preroll.xml";

export const adsConfig = {
  enabled: process.env.NEXT_PUBLIC_ADS_ENABLED === "true",
  vastPreRollUrl:
    (process.env.NEXT_PUBLIC_VAST_PREROLL_URL ?? "").trim() || defaultStaticVastPath,
  /** exoclick | juicyads | custom */
  network: process.env.NEXT_PUBLIC_AD_NETWORK ?? "exoclick",
  providerScript:
    process.env.NEXT_PUBLIC_AD_PROVIDER_SCRIPT ?? "https://a.exoclick.com/ad-provider.js",
} as const;

export function getBannerZoneId(slot: AdBannerSlot): string {
  const key = zoneEnvKeys[slot];
  return process.env[key]?.trim() ?? "";
}

export function getBannerSnippet(slot: AdBannerSlot): string {
  const key = snippetEnvKeys[slot];
  return process.env[key]?.trim() ?? "";
}

export function bannerDivId(slot: AdBannerSlot, instanceKey?: string): string {
  if (!instanceKey) return `dyx-ad-${slot}`;
  return `dyx-ad-${slot}-${instanceKey}`;
}
