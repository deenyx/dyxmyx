import Link from "next/link";
import { ProfileCard } from "@/components/profile-card";
import { ScrollingBanner } from "@/components/scrolling-banner";
import { ModelsDropdown } from "@/components/models-dropdown";
import { getAllProfiles } from "@/lib/profiles";
import { modelNav, modelSectionPath } from "@/lib/model-routes";
import { site } from "@/lib/site";

export default function WelcomePage() {
  const profiles = getAllProfiles();
  const solo = profiles.length === 1 ? profiles[0] : null;

  return (
    <>
      <ScrollingBanner />
      <audio autoPlay muted loop style={{ display: "none" }}>
        <source src="/one.mp3" type="audio/mpeg" />
      </audio>
      <main className="flex-1 flex items-center justify-center" style={{ backgroundImage: "url('/BG1.jpg')", backgroundSize: "contain", backgroundPosition: "center", backgroundAttachment: "fixed", backgroundRepeat: "no-repeat" }}>
        <ModelsDropdown profiles={profiles} />
      </main>
    </>
  );
}
