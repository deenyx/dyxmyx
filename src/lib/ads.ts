export type AdBannerSlot =
  | "videos-header"
  | "videos-list-top"
  | "videos-list-bottom"
  | "videos-sidebar"
  | "videos-player-top"
  | "videos-player-bottom"
  | "videos-footer"
  | "videos-inline"
  | "videos-mobile-inline";

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
