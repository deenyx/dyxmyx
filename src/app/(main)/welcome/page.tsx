import { ScrollingBanner } from "@/components/scrolling-banner";
import { ModelsDropdown } from "@/components/models-dropdown";
import { getAllProfiles } from "@/lib/profiles";
import { ExoClickAd } from "@/components/exoclick-ad";
import { MuteToggle } from "@/components/mute-toggle";

const WELCOME_TOP_ZONE = process.env.NEXT_PUBLIC_AD_ZONE_WELCOME_TOP?.trim() || "5967758";
const WELCOME_BOTTOM_ZONE = process.env.NEXT_PUBLIC_AD_ZONE_WELCOME_BOTTOM?.trim() || "5947828";

export default function WelcomePage() {
  const profiles = getAllProfiles();

  return (
    <>
      <ScrollingBanner />
      <ExoClickAd zoneId={WELCOME_TOP_ZONE} size="compact" className="mx-auto max-w-[728px]" />
      <main className="relative isolate z-20 flex flex-1 items-center justify-center py-6" style={{ backgroundImage: "url('/BG1.jpg')", backgroundSize: "contain", backgroundPosition: "center", backgroundAttachment: "fixed", backgroundRepeat: "no-repeat" }}>
        <div className="relative z-[1000] px-6 py-8 md:px-10 md:py-12 pointer-events-auto">
          <div className="mb-4 flex justify-end">
            <MuteToggle className="z-[2147483647]" />
          </div>
          <ModelsDropdown profiles={profiles} />
        </div>
      </main>
      <ExoClickAd zoneId={WELCOME_BOTTOM_ZONE} size="compact" className="mx-auto max-w-[728px]" />
    </>
  );
}
