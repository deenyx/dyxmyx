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
      <main className="flex-1 flex items-center justify-center" style={{ backgroundImage: "url('/BG1.jpg')", backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed" }}>
      <section className="text-center px-6">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.3em] text-red-400/80 mb-4">Adults Only</p>
          <h1 className="font-serif text-6xl sm:text-7xl tracking-wider text-neutral-50 mb-4">
            {site.name}
          </h1>
          <div className="w-12 h-px bg-gradient-to-r from-transparent via-red-400 to-transparent mx-auto mb-6"></div>
          <p className="text-sm tracking-wider text-neutral-300 max-w-md mx-auto">
            {solo ? solo.name : "Curated Portfolios"}
          </p>
        </div>

        <div className="flex flex-col items-center gap-6 mt-12">
          <ModelsDropdown profiles={profiles} />
          {solo ? (
            <Link
              href={modelSectionPath(solo.username, "bio")}
              className="px-8 py-3 text-xs uppercase tracking-widest text-neutral-950 bg-neutral-100 hover:bg-red-400 transition-all duration-300 font-medium"
            >
              Enter
            </Link>
          ) : null}
        </div>
      </section>
    </main>
    </>
  );
}
