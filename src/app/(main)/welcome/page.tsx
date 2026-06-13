import { ScrollingBanner } from "@/components/scrolling-banner";
import { ModelsDropdown } from "@/components/models-dropdown";
import { getAllProfiles } from "@/lib/profiles";
import { ExoClickAd } from "@/components/exoclick-ad";

export default function WelcomePage() {
  const profiles = getAllProfiles();

  return (
    <>
      <ScrollingBanner />
      <audio autoPlay muted loop style={{ display: "none" }}>
        <source src="/one.mp3" type="audio/mpeg" />
      </audio>
      <ExoClickAd zoneId="5947824" className="mx-auto max-w-[728px]" />
      <main className="flex-1 flex items-center justify-center" style={{ backgroundImage: "url('/BG1.jpg')", backgroundSize: "contain", backgroundPosition: "center", backgroundAttachment: "fixed", backgroundRepeat: "no-repeat" }}>
        <ModelsDropdown profiles={profiles} />
      </main>
      <ExoClickAd zoneId="5947828" className="mx-auto max-w-[728px]" />
    </>
  );
}
